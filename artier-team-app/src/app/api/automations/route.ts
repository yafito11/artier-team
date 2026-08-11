import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { automations } from "@/lib/db/schema";
import { scheduleTask, stopTask } from "@/lib/scheduler/cron";

export async function GET() {
  try {
    const allAutomations = await db.select().from(automations);
    return NextResponse.json(allAutomations);
  } catch (error) {
    console.error("Get automations error:", error);
    return NextResponse.json({ error: "Failed to fetch automations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, cronExpression, prompt, modelId, agentId, isActive } = body;

    const [newAutomation] = await db.insert(automations).values({
      name,
      description,
      cronExpression,
      prompt,
      modelId: modelId || "auto",
      agentId,
      isActive: isActive !== false,
    }).returning();

    if (newAutomation.isActive && newAutomation.cronExpression) {
      scheduleTask({
        id: newAutomation.id,
        name: newAutomation.name,
        cronExpression: newAutomation.cronExpression,
        prompt: newAutomation.prompt || "",
        modelId: newAutomation.modelId || "auto",
        agentId: newAutomation.agentId,
        isActive: newAutomation.isActive,
      });
    }

    return NextResponse.json(newAutomation, { status: 201 });
  } catch (error) {
    console.error("Create automation error:", error);
    return NextResponse.json({ error: "Failed to create automation" }, { status: 500 });
  }
}
