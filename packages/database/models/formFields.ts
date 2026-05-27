import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { formsTable } from "./forms";

export const formFieldsTable = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").notNull().references(() => formsTable.id, { onDelete: "cascade" }),
  
  type: varchar("type", { 
    enum: ["short_text", "long_text", "email", "number", "single_select", "multi_select", "checkbox", "dropdown", "rating", "date"] 
  }).notNull(),
  
  label: text("label").notNull(),
  description: text("description"),
  
  isRequired: boolean("is_required").default(false).notNull(),
  options: jsonb("options"), // Array of strings or objects for select fields
  order: integer("order").notNull(),
  validationRules: jsonb("validation_rules"), // JSON for min, max, etc.
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;
