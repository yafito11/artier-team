import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agentTeams } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [team] = await db.select().from(agentTeams).where(eq(agentTeams.id, id));
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(team);
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, leadAgentId, agentIds, color, maxAgents } = body;

    const [updated] = await db.update(agentTeams)
      .set({ name, description, leadAgentId, agentIds, color, maxAgents, updatedAt: new Date() })
      .where(eq(agentTeams.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update team error:", error);
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(agentTeams).where(eq(agentTeams.id, id)).returning();
    if (!deleted) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Team deleted" });
  } catch (error) {
    console.error("Delete team error:", error);
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
  }
}
