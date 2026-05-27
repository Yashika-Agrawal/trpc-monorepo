import { db } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { decode } from "@auth/core/jwt";

export async function createContext({ req, res }: any) {
  let user = null;
  try {
    const cookies = req.headers?.cookie;
    if (cookies) {
      const parsedCookies = Object.fromEntries(
        cookies.split('; ').map((c: string) => {
          const firstEq = c.indexOf('=');
          if (firstEq === -1) return [c, ''];
          return [c.slice(0, firstEq), c.slice(firstEq + 1)];
        })
      );
      
      const tokenName = 
        parsedCookies['authjs.session-token'] ? 'authjs.session-token' :
        parsedCookies['__Secure-authjs.session-token'] ? '__Secure-authjs.session-token' :
        parsedCookies['next-auth.session-token'] ? 'next-auth.session-token' :
        parsedCookies['__Secure-next-auth.session-token'] ? '__Secure-next-auth.session-token' : null;

      if (tokenName) {
        const sessionToken = parsedCookies[tokenName];
        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "hackathon2026-super-secret";
        
        const decoded = await decode({
          token: sessionToken,
          secret,
          salt: tokenName,
        });

        console.log("Decoded Token:", decoded);
        if (decoded?.id) {
          const foundUser = await db.query.usersTable.findFirst({
            where: eq(usersTable.id, decoded.id as string)
          });
          console.log("Found User:", foundUser?.id);
          if (foundUser) {
            user = foundUser;
          }
        }
      }
    }
  } catch (err) {
    console.error("Context Auth Error:", err);
  }
  console.log("Final User in Context:", user?.id);
  return { req, res, user };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
