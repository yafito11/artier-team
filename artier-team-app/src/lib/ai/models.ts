export interface AIModel {
  id: string;
  name: string;
  provider: string;
  available: boolean;
  contextWindow?: number;
}

export const DEFAULT_MODELS: AIModel[] = [
  { id: "auto", name: "Auto", provider: "Smart routing", available: true },
  { id: "stepfun-3.7-flash", name: "StepFun 3.7 Flash", provider: "Bynara Router", available: true, contextWindow: 128000 },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", available: true, contextWindow: 128000 },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", available: true, contextWindow: 128000 },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", available: true, contextWindow: 200000 },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", available: true, contextWindow: 200000 },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", available: true, contextWindow: 1000000 },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", available: true, contextWindow: 128000 },
];

export async function detectModels(providerId: string, apiKey: string, baseUrl?: string): Promise<AIModel[]> {
  try {
    const url = baseUrl ? `${baseUrl}/models` : "https://api.openai.com/v1/models";
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch models from ${providerId}:`, response.statusText);
      return [];
    }

    const data = await response.json();
    const models = data.data || data.models || [];

    return models.map((model: any) => ({
      id: model.id,
      name: model.id,
      provider: providerId,
      available: true,
      contextWindow: model.context_window,
    }));
  } catch (error) {
    console.error(`Error detecting models for ${providerId}:`, error);
    return [];
  }
}
