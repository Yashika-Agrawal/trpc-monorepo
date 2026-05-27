import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { db } from "@repo/database";
import { responsesTable, responseAnswersTable, formsTable, formFieldsTable } from "@repo/database/schema";
import { eq, inArray } from "drizzle-orm";

export const responsesRouter = router({
  submit: publicProcedure
    .input(z.object({
      formId: z.string().uuid(),
      respondentEmail: z.string().email().optional(),
      answers: z.array(z.object({
        fieldId: z.string().uuid(),
        value: z.string(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      const form = await db.query.formsTable.findFirst({
        where: eq(formsTable.id, input.formId),
      });

      if (!form) throw new Error("Form not found");
      if (form.visibility === "unpublished") {
        if (!ctx.user || ctx.user.id !== form.userId) {
          throw new Error("Form is not available");
        }
      }

      const fields = await db.query.formFieldsTable.findMany({
        where: eq(formFieldsTable.formId, input.formId),
      });

      // Build dynamic Zod schema for response validation
      const schemaShape: Record<string, z.ZodTypeAny> = {};
      for (const field of fields) {
        let baseSchema: z.ZodTypeAny = z.string();

        if (field.type === "email") {
          baseSchema = z.string().email("Invalid email format");
        } else if (field.type === "number" || field.type === "rating") {
          baseSchema = z.string().refine(val => !isNaN(Number(val)), { message: "Must be a valid number" });
        }

        if (field.isRequired) {
          if (baseSchema instanceof z.ZodString) {
            baseSchema = baseSchema.min(1, `${field.label} is required`);
          }
        } else {
          baseSchema = baseSchema.optional().or(z.literal(""));
        }

        schemaShape[field.id] = baseSchema;
      }

      const dynamicSchema = z.object(schemaShape);
      
      const answersObject = input.answers.reduce((acc, curr) => {
        acc[curr.fieldId] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      // Validate using Zod (throws TRPC/Zod error if invalid)
      dynamicSchema.parse(answersObject);

      const [response] = await db.insert(responsesTable).values({
        formId: input.formId,
        respondentEmail: input.respondentEmail,
      }).returning();

      if (input.answers.length > 0) {
        await db.insert(responseAnswersTable).values(
          input.answers.map(ans => ({
            responseId: response.id,
            fieldId: ans.fieldId,
            value: ans.value,
          }))
        );
      }

      return { success: true, responseId: response.id };
    }),

  listByFormId: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const form = await db.query.formsTable.findFirst({
        where: eq(formsTable.id, input.formId),
      });

      if (!form || form.userId !== ctx.user.id) {
        throw new Error("Form not found or unauthorized");
      }

      // Fetch fields so we have labels for the answers
      const fields = await db.query.formFieldsTable.findMany({
        where: eq(formFieldsTable.formId, input.formId),
        orderBy: (f, { asc }) => [asc(f.order)],
      });

      const responses = await db.query.responsesTable.findMany({
        where: eq(responsesTable.formId, input.formId),
        orderBy: (r, { desc }) => [desc(r.submittedAt)],
      });

      // Batch fetch all answers for these responses in one query
      let answers: { responseId: string; fieldId: string; value: string | null }[] = [];
      if (responses.length > 0) {
        answers = await db
          .select({
            responseId: responseAnswersTable.responseId,
            fieldId: responseAnswersTable.fieldId,
            value: responseAnswersTable.value,
          })
          .from(responseAnswersTable)
          .where(inArray(responseAnswersTable.responseId, responses.map(r => r.id)));
      }

      // Group answers by responseId
      const answersByResponse = answers.reduce<Record<string, typeof answers>>((acc, a) => {
        if (!acc[a.responseId]) acc[a.responseId] = [];
        acc[a.responseId].push(a);
        return acc;
      }, {});

      // Shape: each response gets its answers with field label attached
      const shaped = responses.map(r => ({
        ...r,
        answers: (answersByResponse[r.id] ?? []).map(a => ({
          fieldId: a.fieldId,
          value: a.value ?? "",
          label: fields.find(f => f.id === a.fieldId)?.label ?? "Unknown field",
          type: fields.find(f => f.id === a.fieldId)?.type ?? "short_text",
        })),
      }));

      return { responses: shaped, fields };
    }),
});