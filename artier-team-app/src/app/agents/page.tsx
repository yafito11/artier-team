"use client";

import * as React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar/sidebar";
import { PanelLeft, Plus, Bot, Sparkles, MoreVertical, Edit, Trash2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  modelId: string;
  isActive: boolean;
}

export default function AgentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      setAgents(data);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    try {
      await fetch(`/api/agents/${id}`, { method: "DELETE" });
      fetchAgents();
    } catch (error) {
      console.error("Failed to delete agent:", error);
    }
    setMenuOpen(null);
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-fg-primary)]">Agents</h1>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Create and manage your AI agents
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/agents/builder"
                className="flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm font-medium text-[var(--color-fg-secondary)] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-fg-primary)]"
              >
                <Sparkles className="h-4 w-4" />
                Builder via Prompt
              </Link>
              <Link
                href="/agents/new"
                className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)]"
              >
                <Plus className="h-4 w-4" />
                Create Agent
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[var(--color-fg-muted)]">Loading agents...</div>
          ) : agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] py-16">
              <Bot className="mb-4 h-12 w-12 text-[var(--color-fg-subtle)]" />
              <p className="text-lg font-medium text-[var(--color-fg-primary)]">No agents yet</p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Create your first agent to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="group relative rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-5 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                        style={{ backgroundColor: `${agent.color}20` }}
                      >
                        {agent.avatar || "🤖"}
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--color-fg-primary)]">{agent.name}</h3>
                        <p className="text-xs text-[var(--color-fg-muted)]">{agent.modelId}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === agent.id ? null : agent.id)}
                        className="rounded-lg p-1.5 text-[var(--color-fg-muted)] opacity-0 transition-opacity hover:bg-[rgba(255,255,255,0.06)] group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpen === agent.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1 shadow-xl">
                          <Link
                            href={`/agents/${agent.id}`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--color-fg-secondary)] hover:bg-[rgba(255,255,255,0.06)]"
                            onClick={() => setMenuOpen(null)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(agent.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-[rgba(255,255,255,0.06)]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-[var(--color-fg-muted)] line-clamp-2">{agent.description || "No description"}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${agent.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${agent.isActive ? "bg-green-400" : "bg-gray-400"}`} />
                      {agent.isActive ? "Active" : "Inactive"}
                    </span>
                    <Link
                      href={`/chat?agent=${agent.id}`}
                      className="text-xs text-[var(--color-accent)] hover:underline"
                    >
                      Start Chat →
                    </Link>
                  </div>
                </div>
              ))}

              <Link
                href="/agents/builder"
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center transition-all hover:border-[var(--color-accent)]/50 hover:bg-[rgba(255,255,255,0.02)]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                  <Bot className="h-6 w-6 text-[var(--color-accent)]" />
                </div>
                <p className="text-sm font-medium text-[var(--color-fg-primary)]">Create New Agent</p>
                <p className="mt-1 text-xs text-[var(--color-fg-muted)]">Use AI to generate an agent</p>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
