"use client";

import * as React from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { CalendarClock, Plus, Play, Pause, Trash2, MoreVertical, Clock, Loader2 } from "lucide-react";

interface Automation {
  id: string;
  name: string;
  description: string;
  cronExpression: string;
  prompt: string;
  modelId: string;
  isActive: boolean;
  lastRun: string | null;
  nextRun: string | null;
}

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "1",
    name: "Daily Code Review",
    description: "Review all pending pull requests",
    cronExpression: "0 9 * * *",
    prompt: "Review all pending PRs and summarize changes",
    modelId: "auto",
    isActive: true,
    lastRun: "2026-08-11T09:00:00Z",
    nextRun: "2026-08-12T09:00:00Z",
  },
  {
    id: "2",
    name: "Weekly Report",
    description: "Generate weekly progress report",
    cronExpression: "0 17 * * 5",
    prompt: "Generate a summary of this week's coding activity",
    modelId: "auto",
    isActive: true,
    lastRun: "2026-08-08T17:00:00Z",
    nextRun: "2026-08-15T17:00:00Z",
  },
  {
    id: "3",
    name: "Dependency Check",
    description: "Check for outdated dependencies",
    cronExpression: "0 8 * * 1",
    prompt: "Check for outdated npm dependencies and suggest updates",
    modelId: "auto",
    isActive: false,
    lastRun: "2026-08-04T08:00:00Z",
    nextRun: null,
  },
];

function formatCron(expr: string): string {
  const parts = expr.split(" ");
  if (parts.length !== 5) return expr;

  const [min, hour, day, month, dow] = parts;

  if (hour !== "*" && min !== "*" && day === "*" && month === "*" && dow === "*") {
    return `Daily at ${hour}:${min.padStart(2, "0")}`;
  }
  if (hour !== "*" && min !== "*" && dow !== "*") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[parseInt(dow)]} at ${hour}:${min.padStart(2, "0")}`;
  }
  return expr;
}

export default function AutomationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [automations, setAutomations] = React.useState<Automation[]>(MOCK_AUTOMATIONS);
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)
    );
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    setMenuOpen(null);
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-fg-primary)]">Automations</h1>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Schedule automated tasks and workflows
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)]"
            >
              <Plus className="h-4 w-4" />
              Create Automation
            </button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
                  <CalendarClock className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-fg-primary)]">
                    {automations.length}
                  </p>
                  <p className="text-xs text-[var(--color-fg-muted)]">Total Automations</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Play className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-fg-primary)]">
                    {automations.filter(a => a.isActive).length}
                  </p>
                  <p className="text-xs text-[var(--color-fg-muted)]">Active</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-fg-primary)]">
                    {automations.filter(a => !a.isActive).length}
                  </p>
                  <p className="text-xs text-[var(--color-fg-muted)]">Paused</p>
                </div>
              </div>
            </div>
          </div>

          {/* Automation List */}
          <div className="space-y-3">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="group rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-5 transition-all hover:border-[var(--color-accent)]/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      automation.isActive ? "bg-[var(--color-accent)]/10" : "bg-[var(--color-bg-muted)]"
                    }`}>
                      <CalendarClock className={`h-6 w-6 ${
                        automation.isActive ? "text-[var(--color-accent)]" : "text-[var(--color-fg-muted)]"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[var(--color-fg-primary)]">{automation.name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                          automation.isActive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            automation.isActive ? "bg-green-400" : "bg-gray-400"
                          }`} />
                          {automation.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{automation.description}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-fg-subtle)]">
                        <span>📅 {formatCron(automation.cronExpression)}</span>
                        <span>🤖 {automation.modelId}</span>
                        {automation.lastRun && (
                          <span>Last: {new Date(automation.lastRun).toLocaleDateString()}</span>
                        )}
                        {automation.nextRun && (
                          <span>Next: {new Date(automation.nextRun).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAutomation(automation.id)}
                      className={`rounded-lg p-2 transition-colors ${
                        automation.isActive
                          ? "text-green-400 hover:bg-green-500/10"
                          : "text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)]"
                      }`}
                      title={automation.isActive ? "Pause" : "Start"}
                    >
                      {automation.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === automation.id ? null : automation.id)}
                        className="rounded-lg p-2 text-[var(--color-fg-muted)] opacity-0 transition-opacity hover:bg-[rgba(255,255,255,0.06)] group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpen === automation.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1 shadow-xl">
                          <button
                            onClick={() => deleteAutomation(automation.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-[rgba(255,255,255,0.06)]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prompt Preview */}
                <div className="mt-4 rounded-lg bg-[var(--color-bg-muted)] p-3">
                  <p className="text-xs text-[var(--color-fg-subtle)] mb-1">Prompt:</p>
                  <p className="text-sm text-[var(--color-fg-secondary)] line-clamp-2">{automation.prompt}</p>
                </div>
              </div>
            ))}

            {automations.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] py-16">
                <CalendarClock className="mb-4 h-12 w-12 text-[var(--color-fg-subtle)]" />
                <p className="text-sm font-medium text-[var(--color-fg-primary)]">No automations yet</p>
                <p className="mt-1 text-xs text-[var(--color-fg-muted)]">Create your first automation to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
