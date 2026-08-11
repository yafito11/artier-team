import * as cron from "node-cron";
import { db } from "@/lib/db";
import { automations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  prompt: string;
  modelId: string;
  agentId: string | null;
  isActive: boolean;
}

const activeTasks = new Map<string, cron.ScheduledTask>();

export async function startScheduler() {
  console.log("[Scheduler] Starting automation scheduler...");

  const activeAutomations = await db
    .select()
    .from(automations)
    .where(eq(automations.isActive, true));

  for (const automation of activeAutomations) {
    if (automation.cronExpression) {
      scheduleTask({
        ...automation,
        cronExpression: automation.cronExpression,
        prompt: automation.prompt || "",
        modelId: automation.modelId || "auto",
      });
    }
  }

  console.log(`[Scheduler] Started ${activeAutomations.length} scheduled tasks`);
}

export function scheduleTask(automation: ScheduledTask) {
  stopTask(automation.id);

  if (!cron.validate(automation.cronExpression)) {
    console.error(`[Scheduler] Invalid cron expression for ${automation.name}: ${automation.cronExpression}`);
    return;
  }

  const task = cron.schedule(automation.cronExpression, async () => {
    console.log(`[Scheduler] Running automation: ${automation.name}`);

    try {
      await db
        .update(automations)
        .set({ lastRun: new Date() })
        .where(eq(automations.id, automation.id));

      await executeAutomation(automation);

      console.log(`[Scheduler] Completed automation: ${automation.name}`);
    } catch (error) {
      console.error(`[Scheduler] Error running automation ${automation.name}:`, error);
    }
  });

  activeTasks.set(automation.id, task);
}

export function stopTask(id: string) {
  const task = activeTasks.get(id);
  if (task) {
    task.stop();
    activeTasks.delete(id);
  }
}

export function stopAllTasks() {
  for (const [, task] of activeTasks) {
    task.stop();
  }
  activeTasks.clear();
}

async function executeAutomation(automation: ScheduledTask) {
  console.log(`[Scheduler] Would execute prompt: ${automation.prompt}`);
  console.log(`[Scheduler] Model: ${automation.modelId}`);
  if (automation.agentId) {
    console.log(`[Scheduler] Agent: ${automation.agentId}`);
  }
}
