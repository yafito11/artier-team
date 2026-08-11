import { pgTable, uuid, varchar, text, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  systemPrompt: text("system_prompt"),
  modelId: varchar("model_id", { length: 100 }).default("auto"),
  avatar: varchar("avatar", { length: 10 }),
  color: varchar("color", { length: 7 }),
  tools: jsonb("tools").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
