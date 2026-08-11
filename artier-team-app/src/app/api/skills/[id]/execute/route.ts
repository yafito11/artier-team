import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { input } = body;

    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    let result;
    if (skill.type === "cli-executable" && skill.cliCommand) {
      result = {
        status: "success",
        output: `[Simulated] Executed: ${skill.cliCommand}\nInput: ${input || "none"}`,
        timestamp: new Date().toISOString(),
      };
    } else if (skill.type === "prompt-only" && skill.promptTemplate) {
      result = {
        status: "success",
        output: `[Simulated] Prompt template applied:\n${skill.promptTemplate}\nInput: ${input || "none"}`,
        timestamp: new Date().toISOString(),
      };
    } else {
      result = {
        status: "error",
        output: "Skill has no execution method configured",
        timestamp: new Date().toISOString(),
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Execute skill error:", error);
    return NextResponse.json({ error: "Failed to execute skill" }, { status: 500 });
  }
}
