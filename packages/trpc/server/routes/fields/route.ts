import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import { db } from "@repo/database";
import { formFieldsTable, formsTable } from "@repo/database/schema";
import { eq } from "drizzle-orm";

export const fieldsRouter = router({
  upsertFields: protectedProcedure
    .input(z.object({
      formId: z.string().uuid(),
      fields: z.array(z.object({
        id: z.string().uuid().optional(),
        type: z.enum(["short_text", "long_text", "email", "number", "single_select", "multi_select", "checkbox", "dropdown", "rating", "date"]),
        label: z.string().min(1),
        description: z.string().optional().nullable(),
        isRequired: z.boolean().default(false),
        options: z.any().optional(),
        order: z.number(),
        validationRules: z.any().optional(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      // First verify form ownership
      const form = await db.query.formsTable.findFirst({
        where: eq(formsTable.id, input.formId),
      });
      if (!form || form.userId !== ctx.user.id) {
        throw new Error("Form not found or unauthorized");
      }

      // We should ideally do this in a transaction, deleting old fields and inserting new ones
      // For simplicity in this hackathon, we'll delete all fields for this form and re-insert
      await db.delete(formFieldsTable).where(eq(formFieldsTable.formId, input.formId));

      if (input.fields.length > 0) {
        const fieldsToInsert = input.fields.map(f => ({
          ...f,
          id: f.id || undefined,
          formId: input.formId,
        }));
        await db.insert(formFieldsTable).values(fieldsToInsert);
      }
      
      return { success: true };
    }),

  listByFormId: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ input }) => {
      const fields = await db.query.formFieldsTable.findMany({
        where: eq(formFieldsTable.formId, input.formId),
        orderBy: (fields, { asc }) => [asc(fields.order)],
      });
      return fields;
    }),
});
