import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const testProvider = createOpenAI({
  apiKey: process.env.TEST_PROVIDER_API_KEY || "",
  baseURL: process.env.TEST_PROVIDER_URL || "https://router.bynara.id/v1",
});

function getProvider(modelId: string) {
  if (modelId.startsWith("stepfun")) {
    return testProvider;
  }
  if (modelId.startsWith("claude")) {
    return anthropic;
  }
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
    return testProvider;
  }
  return openai;
}

function getModelId(modelId: string) {
  if (modelId === "auto") {
    return process.env.TEST_PROVIDER_MODEL || "stepfun-3.7-flash";
  }
  return modelId;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model, agentSystemPrompt } = body;

    const modelId = getModelId(model || "auto");
    const provider = getProvider(modelId);

    const systemPrompt = agentSystemPrompt || `You are a helpful AI assistant. Follow these strict formatting rules:

1. Use clean Markdown structure with double line breaks between sections for breathing room.
2. Use list items with dashes (-) for bullet points.
3. Start each point with a relevant emoji that matches the topic.
4. Start each point with bold keyword followed by em-dash. Example: - 🧠 Analisis Masalah — explanation here.
5. Do NOT use code blocks for descriptive text, only for actual code.
6. Keep responses concise and well-structured.
7. Respond in the same language as the user's message.`;

    const result = streamText({
      model: provider(modelId),
      messages,
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
