import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";

export async function GET() {
  try {
    const allSkills = await db.select().from(skills);
    return NextResponse.json(allSkills);
  } catch (error) {
    console.error("Get skills error:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, type, promptTemplate, cliCommand, requiresApproval, tools } = body;

    const [newSkill] = await db.insert(skills).values({
      name,
      description,
      type: type || "prompt-only",
      promptTemplate,
      cliCommand,
      requiresApproval: requiresApproval || false,
      tools: tools || [],
    }).returning();

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
