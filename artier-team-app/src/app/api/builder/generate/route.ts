import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const testProvider = createOpenAI({
  apiKey: process.env.TEST_PROVIDER_API_KEY || "",
  baseURL: process.env.TEST_PROVIDER_URL || "https://router.bynara.id/v1",
});

const agentSchema = z.object({
  name: z.string().describe("Agent name"),
  description: z.string().describe("Agent description"),
  systemPrompt: z.string().describe("System prompt for the agent"),
  modelId: z.string().describe("Recommended model ID"),
  avatar: z.string().describe("Single emoji for avatar"),
  color: z.string().describe("Hex color code"),
  tools: z.array(z.string()).describe("Tools this agent can use"),
});

const teamSchema = z.object({
  name: z.string().describe("Team name"),
  description: z.string().describe("Team description"),
  color: z.string().describe("Hex color code"),
  leadAgent: agentSchema.describe("Lead agent configuration"),
  subAgents: z.array(agentSchema).describe("Sub agents in the team"),
});

export async function POST(req: Request) {
  try {
    const { prompt, type = "agent" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (type === "team") {
      const result = await generateObject({
        model: testProvider("stepfun-3.7-flash"),
        schema: teamSchema,
        prompt: `Based on this description, create an AI agent team configuration: "${prompt}"
        
        Requirements:
        - Team should have a clear name and purpose
        - Lead agent should be the primary decision maker
        - Sub agents should handle specific tasks
        - Each agent should have appropriate tools
        - Use relevant emojis and colors`,
      });

      return NextResponse.json({ type: "team", data: result.object });
    }

    const result = await generateObject({
      model: testProvider("stepfun-3.7-flash"),
      schema: agentSchema,
      prompt: `Based on this description, create an AI agent configuration: "${prompt}"
      
      Requirements:
      - Agent should have a clear, descriptive name
      - System prompt should define the agent's role and capabilities
      - Choose an appropriate model for the task
      - Select a relevant emoji for the avatar
      - Choose a color that represents the agent's purpose
      - List relevant tools the agent needs`,
    });

    return NextResponse.json({ type: "agent", data: result.object });
  } catch (error) {
    console.error("Builder generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate agent configuration" },
      { status: 500 }
    );
  }
}
