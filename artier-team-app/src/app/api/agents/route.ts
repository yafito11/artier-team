import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";

export async function GET() {
  try {
    const allAgents = await db.select().from(agents);
    return NextResponse.json(allAgents);
  } catch (error) {
    console.error("Get agents error:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, systemPrompt, modelId, avatar, color, tools } = body;

    const [newAgent] = await db.insert(agents).values({
      name,
      description,
      systemPrompt,
      modelId: modelId || "auto",
      avatar,
      color,
      tools: tools || [],
    }).returning();

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error("Create agent error:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
