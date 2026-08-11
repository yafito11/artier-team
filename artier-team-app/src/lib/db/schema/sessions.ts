import { pgTable, uuid, varchar, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }),
  modelId: varchar("model_id", { length: 100 }).default("auto"),
  agentId: uuid("agent_id"),
  teamId: uuid("team_id"),
  messages: jsonb("messages").$type<any[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
