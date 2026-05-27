import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  
  visibility: varchar("visibility", { enum: ["public", "unlisted", "unpublished"] }).default("unpublished").notNull(),
  theme: varchar("theme", { length: 100 }).default("default").notNull(),
  
  isArchived: boolean("is_archived").default(false).notNull(),
  hasExpiry: boolean("has_expiry").default(false).notNull(),
  expiryDate: timestamp("expiry_date"),
  responseLimit: integer("response_limit"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
