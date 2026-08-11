import { pgTable, uuid, varchar, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const automations = pgTable("automations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  cronExpression: varchar("cron_expression", { length: 50 }),
  prompt: text("prompt"),
  modelId: varchar("model_id", { length: 100 }).default("auto"),
  agentId: uuid("agent_id"),
  isActive: boolean("is_active").default(true).notNull(),
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  config: jsonb("config").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Automation = typeof automations.$inferSelect;
export type NewAutomation = typeof automations.$inferInsert;
