import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agentTeams } from "@/lib/db/schema";

export async function GET() {
  try {
    const allTeams = await db.select().from(agentTeams);
    return NextResponse.json(allTeams);
  } catch (error) {
    console.error("Get teams error:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, leadAgentId, agentIds, color, maxAgents } = body;

    const [newTeam] = await db.insert(agentTeams).values({
      name,
      description,
      leadAgentId,
      agentIds: agentIds || [],
      color,
      maxAgents: maxAgents || 5,
    }).returning();

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}
