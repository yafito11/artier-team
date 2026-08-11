import { pgTable, uuid, varchar, text, boolean, integer, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { providers } from "./providers";

export const models = pgTable("models", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerId: uuid("provider_id").references(() => providers.id, { onDelete: "cascade" }).notNull(),
  modelId: varchar("model_id", { length: 100 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  available: boolean("available").default(true).notNull(),
  contextWindow: integer("context_window"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Model = typeof models.$inferSelect;
export type NewModel = typeof models.$inferInsert;
