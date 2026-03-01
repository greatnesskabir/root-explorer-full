import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roots = pgTable("roots", {
  id: serial("id").primaryKey(),
  root: text("root").notNull().unique(), // The Arabic root itself
  word: text("word").notNull(), // The originally searched word
  shortDefinition: text("short_definition").notNull(),
  coreMeaning: text("core_meaning").notNull(),
  why: text("why").notNull(),
  contrast: text("contrast").notNull(),
  derivedForms: text("derived_forms").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRootSchema = createInsertSchema(roots).omit({ id: true, createdAt: true });

export type Root = typeof roots.$inferSelect;
export type InsertRoot = z.infer<typeof insertRootSchema>;
