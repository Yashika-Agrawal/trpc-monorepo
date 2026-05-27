import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { db } from "@repo/database";
import { formsTable } from "@repo/database/schema";
import { eq } from "drizzle-orm";

export const formsRouter = router({
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      slug: z.string().min(3),
    }))
    .mutation(async ({ input, ctx }) => {
      const [form] = await db.insert(formsTable).values({
        title: input.title,
        description: input.description,
        slug: input.slug,
        userId: ctx.user.id,
      }).returning();
      return form;
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      const forms = await db.query.formsTable.findMany({
        where: eq(formsTable.userId, ctx.user.id),
        orderBy: (forms, { desc }) => [desc(forms.createdAt)],
      });
      return forms;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const form = await db.query.formsTable.findFirst({
        where: eq(formsTable.id, input.id),
      });
      if (!form || form.userId !== ctx.user.id) {
        throw new Error("Form not found or unauthorized");
      }
      return form;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().optional(),
      description: z.string().optional(),
      slug: z.string().optional(),
      visibility: z.enum(["public", "unlisted", "unpublished"]).optional(),
      theme: z.string().optional(),
      isArchived: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;
      const [form] = await db.update(formsTable)
        .set(updates)
        .where(eq(formsTable.id, id))
        .returning();
      return form;
    }),
});
