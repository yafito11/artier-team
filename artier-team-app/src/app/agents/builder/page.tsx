"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Sparkles, Bot, Users, ArrowLeft, Loader2, Save, RefreshCw } from "lucide-react";

interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  modelId: string;
  avatar: string;
  color: string;
  tools: string[];
}

interface TeamConfig {
  name: string;
  description: string;
  color: string;
  leadAgent: AgentConfig;
  subAgents: AgentConfig[];
}

export default function AgentBuilderPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mode, setMode] = React.useState<"agent" | "team">("agent");
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState<AgentConfig | TeamConfig | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/builder/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: mode }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate");
      }

      const data = await response.json();
      setGenerated(data.data);
    } catch (err) {
      setError("Failed to generate agent configuration. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generated) return;

    try {
      const endpoint = mode === "team" ? "/api/teams" : "/api/agents";
      const body = mode === "team"
        ? {
            name: (generated as TeamConfig).name,
            description: (generated as TeamConfig).description,
            color: (generated as TeamConfig).color,
            agentIds: [],
          }
        : {
            name: (generated as AgentConfig).name,
            description: (generated as AgentConfig).description,
            systemPrompt: (generated as AgentConfig).systemPrompt,
            modelId: (generated as AgentConfig).modelId,
            avatar: (generated as AgentConfig).avatar,
            color: (generated as AgentConfig).color,
            tools: (generated as AgentConfig).tools,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        router.push("/agents");
      }
    } catch (err) {
      setError("Failed to save. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Agents
            </button>
            <h1 className="text-2xl font-bold text-[var(--color-fg-primary)]">Agent Builder</h1>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
              Describe what you need and let AI create the perfect agent
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setMode("agent")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "agent"
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[rgba(255,255,255,0.04)] text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.08)]"
              }`}
            >
              <Bot className="h-4 w-4" />
              Single Agent
            </button>
            <button
              onClick={() => setMode("team")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === "team"
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[rgba(255,255,255,0.04)] text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.08)]"
              }`}
            >
              <Users className="h-4 w-4" />
              Agent Team
            </button>
          </div>

          {/* Prompt Input */}
          <div className="mb-6 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === "agent"
                  ? "Describe the agent you want to create... (e.g., 'A code review agent that specializes in TypeScript and React')"
                  : "Describe the team you want to create... (e.g., 'A full-stack development team with frontend, backend, and DevOps specialists')"
              }
              rows={4}
              className="w-full resize-none bg-transparent text-sm text-[var(--color-fg-primary)] placeholder-[var(--color-fg-subtle)] focus:outline-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Generated Preview */}
          {generated && (
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-fg-primary)]">Generated Configuration</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)]"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
              </div>

              {mode === "agent" ? (
                <AgentPreview config={generated as AgentConfig} />
              ) : (
                <TeamPreview config={generated as TeamConfig} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AgentPreview({ config }: { config: AgentConfig }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: `${config.color}20` }}
        >
          {config.avatar}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--color-fg-primary)]">{config.name}</h3>
          <p className="text-sm text-[var(--color-fg-muted)]">{config.description}</p>
        </div>
      </div>

      <div className="rounded-lg bg-[var(--color-bg-muted)] p-4">
        <h4 className="mb-2 text-xs font-semibold uppercase text-[var(--color-fg-subtle)]">System Prompt</h4>
        <p className="text-sm text-[var(--color-fg-secondary)] whitespace-pre-wrap">{config.systemPrompt}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-[var(--color-bg-muted)] p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase text-[var(--color-fg-subtle)]">Model</h4>
          <p className="text-sm text-[var(--color-fg-secondary)]">{config.modelId}</p>
        </div>
        <div className="rounded-lg bg-[var(--color-bg-muted)] p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase text-[var(--color-fg-subtle)]">Tools</h4>
          <div className="flex flex-wrap gap-1">
            {config.tools.map((tool) => (
              <span key={tool} className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs text-[var(--color-accent)]">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamPreview({ config }: { config: TeamConfig }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: `${config.color}20` }}
        >
          👥
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--color-fg-primary)]">{config.name}</h3>
          <p className="text-sm text-[var(--color-fg-muted)]">{config.description}</p>
        </div>
      </div>

      {/* Lead Agent */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-[var(--color-fg-primary)]">Lead Agent</h4>
        <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-bg-muted)] p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
              style={{ backgroundColor: `${config.leadAgent.color}20` }}
            >
              {config.leadAgent.avatar}
            </div>
            <div>
              <p className="font-medium text-[var(--color-fg-primary)]">{config.leadAgent.name}</p>
              <p className="text-xs text-[var(--color-fg-muted)]">{config.leadAgent.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Agents */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-[var(--color-fg-primary)]">Sub Agents ({config.subAgents.length})</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.subAgents.map((agent, i) => (
            <div key={i} className="rounded-lg bg-[var(--color-bg-muted)] p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: `${agent.color}20` }}
                >
                  {agent.avatar}
                </div>
                <div>
                  <p className="font-medium text-[var(--color-fg-primary)]">{agent.name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{agent.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
