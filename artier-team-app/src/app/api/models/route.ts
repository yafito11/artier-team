import { NextResponse } from "next/server";
import { detectModels, DEFAULT_MODELS } from "@/lib/ai/models";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");
  const apiKey = searchParams.get("apiKey");
  const baseUrl = searchParams.get("baseUrl");

  if (!provider || !apiKey) {
    return NextResponse.json(DEFAULT_MODELS);
  }

  const detectedModels = await detectModels(provider, apiKey, baseUrl || undefined);

  if (detectedModels.length === 0) {
    return NextResponse.json(DEFAULT_MODELS);
  }

  return NextResponse.json([
    { id: "auto", name: "Auto", provider: "Smart routing", available: true },
    ...detectedModels,
  ]);
}
