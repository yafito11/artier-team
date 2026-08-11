import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const allSessions = await db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.updatedAt));
    return NextResponse.json(allSessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, modelId, agentId, teamId, messages } = body;

    const [newSession] = await db.insert(sessions).values({
      title: title || "New Chat",
      modelId: modelId || "auto",
      agentId,
      teamId,
      messages: messages || [],
    }).returning();

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
