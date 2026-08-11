import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (error) {
    console.error("Get skill error:", error);
    return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, type, promptTemplate, cliCommand, requiresApproval, tools } = body;

    const [updated] = await db.update(skills)
      .set({ name, description, type, promptTemplate, cliCommand, requiresApproval, tools, updatedAt: new Date() })
      .where(eq(skills.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update skill error:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(skills).where(eq(skills.id, id)).returning();
    if (!deleted) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Skill deleted" });
  } catch (error) {
    console.error("Delete skill error:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
