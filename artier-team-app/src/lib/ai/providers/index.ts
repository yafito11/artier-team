import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

export interface ProviderConfig {
  id: string;
  name: string;
  type: "openai-compatible" | "anthropic";
  apiKey: string;
  baseUrl?: string;
}

export function createProvider(config: ProviderConfig) {
  switch (config.type) {
    case "openai-compatible":
      return createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseUrl || "https://api.openai.com/v1",
      });
    case "anthropic":
      return createAnthropic({
        apiKey: config.apiKey,
      });
    default:
      throw new Error(`Unknown provider type: ${config.type}`);
  }
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    type: "openai-compatible",
    apiKey: process.env.OPENAI_API_KEY || "",
    baseUrl: "https://api.openai.com/v1",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    type: "anthropic",
    apiKey: process.env.ANTHROPIC_API_KEY || "",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    type: "openai-compatible",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseUrl: "https://openrouter.ai/api/v1",
  },
];

export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
