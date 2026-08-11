import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { providers } from "@/lib/db/schema";

export async function GET() {
  try {
    const allProviders = await db.select().from(providers);
    return NextResponse.json(allProviders);
  } catch (error) {
    console.error("Get providers error:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, baseUrl, apiKeyEncrypted } = body;

    const [newProvider] = await db.insert(providers).values({
      name,
      type: type || "openai-compatible",
      baseUrl,
      apiKeyEncrypted,
    }).returning();

    return NextResponse.json(newProvider, { status: 201 });
  } catch (error) {
    console.error("Create provider error:", error);
    return NextResponse.json({ error: "Failed to create provider" }, { status: 500 });
  }
}
