"use client";

import * as React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Plus, Zap, Terminal, FileText, MoreVertical, Edit, Trash2, Play, ChevronRight } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  description: string;
  type: string;
  promptTemplate: string | null;
  cliCommand: string | null;
  requiresApproval: boolean;
  tools: string[];
  isActive: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  "prompt-only": <FileText className="h-4 w-4" />,
  "cli-executable": <Terminal className="h-4 w-4" />,
};

const TYPE_LABELS: Record<string, string> = {
  "prompt-only": "Prompt Only",
  "cli-executable": "CLI Executable",
};

export default function SkillsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState<Skill | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    type: "prompt-only",
    promptTemplate: "",
    cliCommand: "",
    requiresApproval: false,
  });

  React.useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setEditingSkill(null);
        setFormData({ name: "", description: "", type: "prompt-only", promptTemplate: "", cliCommand: "", requiresApproval: false });
        fetchSkills();
      }
    } catch (error) {
      console.error("Failed to save skill:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      fetchSkills();
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description || "",
      type: skill.type,
      promptTemplate: skill.promptTemplate || "",
      cliCommand: skill.cliCommand || "",
      requiresApproval: skill.requiresApproval,
    });
    setShowForm(true);
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
              <h1 className="text-2xl font-bold text-[var(--color-fg-primary)]">Skills</h1>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Create and manage reusable skills for your agents
              </p>
            </div>
            <button
              onClick={() => { setEditingSkill(null); setFormData({ name: "", description: "", type: "prompt-only", promptTemplate: "", cliCommand: "", requiresApproval: false }); setShowForm(true); }}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)]"
            >
              <Plus className="h-4 w-4" />
              Create Skill
            </button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-4">
              <div className="text-sm text-[var(--color-fg-muted)]">Total Skills</div>
              <div className="mt-1 text-2xl font-bold text-[var(--color-fg-primary)]">{skills.length}</div>
            </div>
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-4">
              <div className="text-sm text-[var(--color-fg-muted)]">Prompt Only</div>
              <div className="mt-1 text-2xl font-bold text-[var(--color-accent)]">{skills.filter(s => s.type === "prompt-only").length}</div>
            </div>
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-4">
              <div className="text-sm text-[var(--color-fg-muted)]">CLI Executable</div>
              <div className="mt-1 text-2xl font-bold text-green-400">{skills.filter(s => s.type === "cli-executable").length}</div>
            </div>
          </div>

          {/* Skills List */}
          {loading ? (
            <div className="text-center py-12 text-[var(--color-fg-muted)]">Loading skills...</div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] py-16">
              <Zap className="mb-4 h-12 w-12 text-[var(--color-fg-subtle)]" />
              <p className="text-lg font-medium text-[var(--color-fg-primary)]">No skills yet</p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Create your first skill to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="group relative rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-5 transition-all hover:border-[var(--color-accent)]/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                        {TYPE_ICONS[skill.type] || <Zap className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-[var(--color-fg-primary)]">{skill.name}</h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-xs text-[var(--color-fg-muted)]">
                            {TYPE_LABELS[skill.type] || skill.type}
                          </span>
                          {skill.requiresApproval && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
                              Requires Approval
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-[var(--color-fg-muted)] line-clamp-1">{skill.description || "No description"}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-fg-subtle)]">
                          <span>Created {new Date(skill.createdAt).toLocaleDateString()}</span>
                          {skill.tools && skill.tools.length > 0 && (
                            <span>{skill.tools.length} tool{skill.tools.length > 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/chat?skill=${skill.id}`}
                        className="flex items-center gap-1 rounded-lg bg-[var(--color-accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/20"
                      >
                        <Play className="h-3 w-3" />
                        Use
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === skill.id ? null : skill.id)}
                          className="rounded-lg p-1.5 text-[var(--color-fg-muted)] opacity-0 transition-opacity hover:bg-[rgba(255,255,255,0.06)] group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {menuOpen === skill.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1 shadow-xl">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--color-fg-secondary)] hover:bg-[rgba(255,255,255,0.06)]"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(skill.id)}
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
                </div>
              ))}
            </div>
          )}

          {/* Skill Form Modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-6 shadow-2xl">
                <h2 className="mb-4 text-lg font-semibold text-[var(--color-fg-primary)]">
                  {editingSkill ? "Edit Skill" : "Create Skill"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-[var(--color-fg-secondary)]">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[var(--color-fg-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--color-fg-secondary)]">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[var(--color-fg-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--color-fg-secondary)]">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[var(--color-fg-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                    >
                      <option value="prompt-only">Prompt Only</option>
                      <option value="cli-executable">CLI Executable</option>
                    </select>
                  </div>
                  {formData.type === "prompt-only" ? (
                    <div>
                      <label className="mb-1 block text-sm text-[var(--color-fg-secondary)]">Prompt Template</label>
                      <textarea
                        value={formData.promptTemplate}
                        onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                        className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-3 py-2 font-mono text-sm text-[var(--color-fg-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                        rows={4}
                        placeholder="Enter the prompt template..."
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1 block text-sm text-[var(--color-fg-secondary)]">CLI Command</label>
                      <input
                        type="text"
                        value={formData.cliCommand}
                        onChange={(e) => setFormData({ ...formData, cliCommand: e.target.value })}
                        className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-3 py-2 font-mono text-sm text-[var(--color-fg-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                        placeholder="e.g., npm run lint"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="requiresApproval"
                      checked={formData.requiresApproval}
                      onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                      className="h-4 w-4 rounded border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)]"
                    />
                    <label htmlFor="requiresApproval" className="text-sm text-[var(--color-fg-secondary)]">
                      Requires approval before execution
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setEditingSkill(null); }}
                      className="rounded-lg px-4 py-2 text-sm text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
                    >
                      {editingSkill ? "Save Changes" : "Create Skill"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
