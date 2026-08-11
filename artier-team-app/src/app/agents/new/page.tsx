"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const AVATARS = ["🤖", "💻", "🔍", "✍️", "🚀", "📊", "🎨", "🔧", "🧠", "⚡", "🎯", "📝"];
const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#22c55e", "#eab308", "#f97316", "#06b6d4", "#6366f1"];

export default function NewAgentPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    systemPrompt: "",
    modelId: "auto",
    avatar: "🤖",
    color: "#0ea5e9",
    tools: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/agents");
      }
    } catch (error) {
      console.error("Failed to create agent:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <div className="mb-8">
            <Link
              href="/agents"
              className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Agents
            </Link>
            <h1 className="text-2xl font-bold text-[var(--color-fg-primary)]">Create Agent</h1>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
              Set up a new AI agent with custom behavior and capabilities
            </p>
          </div>

          <div className="mb-8 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-6">
            <h2 className="mb-4 text-sm font-medium text-[var(--color-fg-secondary)]">Preview</h2>
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {formData.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg-primary)]">
                  {formData.name || "Agent Name"}
                </h3>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  {formData.description || "No description"}
                </p>
                <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">
                  Model: {formData.modelId}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-fg-secondary)]">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all ${
                      formData.avatar === avatar
                        ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg-elevated)]"
                        : "hover:bg-[rgba(255,255,255,0.06)]"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-fg-secondary)]">Color</label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-8 w-8 rounded-full transition-all ${
                      formData.color === color
                        ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg-elevated)]"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-fg-secondary)]">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--color-fg-primary)] placeholder-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:outline-none"
                placeholder="e.g., Code Assistant"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-fg-secondary)]">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--color-fg-primary)] placeholder-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:outline-none"
                rows={2}
                placeholder="What does this agent do?"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-fg-secondary)]">System Prompt</label>
              <textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 font-mono text-sm text-[var(--color-fg-primary)] placeholder-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:outline-none"
                rows={6}
                placeholder="You are a helpful assistant that..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-fg-secondary)]">Default Model</label>
              <select
                value={formData.modelId}
                onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--color-fg-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="auto">Auto (Use global model)</option>
                <option value="stepfun-3.7-flash">StepFun 3.7 Flash</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link
                href="/agents"
                className="rounded-lg px-4 py-2 text-sm text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Creating..." : "Create Agent"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
