import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { db } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "hackathon2026-super-secret";

export const authRouter = router({
  signup: publicProcedure
    .input(z.object({
      fullName: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input }) => {
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT", message: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const [newUser] = await db.insert(usersTable).values({
        fullName: input.fullName,
        email: input.email,
        password: passwordHash,
      }).returning();
      
      return { success: true, user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName } };
    }),
});
