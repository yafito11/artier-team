import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    return NextResponse.json(agent);
  } catch (error) {
    console.error("Get agent error:", error);
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, systemPrompt, modelId, avatar, color, tools, isActive } = body;

    const [updated] = await db.update(agents)
      .set({ name, description, systemPrompt, modelId, avatar, color, tools, isActive, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update agent error:", error);
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(agents).where(eq(agents.id, id)).returning();
    if (!deleted) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Agent deleted" });
  } catch (error) {
    console.error("Delete agent error:", error);
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}
