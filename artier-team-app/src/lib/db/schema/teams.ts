import { pgTable, uuid, varchar, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

export const agentTeams = pgTable("agent_teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  leadAgentId: uuid("lead_agent_id"),
  agentIds: jsonb("agent_ids").$type<string[]>().default([]),
  color: varchar("color", { length: 7 }),
  maxAgents: integer("max_agents").default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AgentTeam = typeof agentTeams.$inferSelect;
export type NewAgentTeam = typeof agentTeams.$inferInsert;
