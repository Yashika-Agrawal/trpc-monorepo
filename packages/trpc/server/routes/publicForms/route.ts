import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { db } from "@repo/database";
import { formsTable, formFieldsTable } from "@repo/database/schema";
import { eq } from "drizzle-orm";

export const publicFormsRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const form = await db.query.formsTable.findFirst({
        where: eq(formsTable.slug, input.slug),
      });
      
      if (!form) throw new Error("Form not found");
      
      if (form.visibility === "unpublished") {
        if (!ctx.user || ctx.user.id !== form.userId) {
          throw new Error("Form is not available");
        }
      }

      // Fetch fields manually if relations not set up
      const fields = await db.query.formFieldsTable.findMany({
        where: eq(formFieldsTable.formId, form.id),
        orderBy: (fields, { asc }) => [asc(fields.order)],
      });

      return { form, fields };
    }),

  listExplore: publicProcedure
    .query(async () => {
      const forms = await db.query.formsTable.findMany({
        where: eq(formsTable.visibility, "public"),
        orderBy: (forms, { desc }) => [desc(forms.createdAt)],
      });
      return forms;
    }),
});
