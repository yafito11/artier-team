import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const providers = pgTable("providers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("openai-compatible"),
  baseUrl: text("base_url"),
  apiKeyEncrypted: text("api_key_encrypted"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;
