"use client";

import * as React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Plus, Users, Bot, MoreVertical, Edit, Trash2, ChevronRight } from "lucide-react";

interface AgentTeam {
  id: string;
  name: string;
  description: string;
  leadAgentId: string | null;
  agentIds: string[];
  color: string;
  maxAgents: number;
  createdAt: string;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export default function TeamsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [teams, setTeams] = React.useState<AgentTeam[]>([]);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [editingTeam, setEditingTeam] = React.useState<AgentTeam | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    leadAgentId: "",
    agentIds: [] as string[],
    color: "#0ea5e9",
    maxAgents: 5,
  });

  React.useEffect(() => {
    fetchTeams();
    fetchAgents();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      setAgents(data);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTeam ? `/api/teams/${editingTeam.id}` : "/api/teams";
      const method = editingTeam ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setEditingTeam(null);
        setFormData({ name: "", description: "", leadAgentId: "", agentIds: [], color: "#0ea5e9", maxAgents: 5 });
        fetchTeams();
      }
    } catch (error) {
      console.error("Failed to save team:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/teams/${id}`, { method: "DELETE" });
      fetchTeams();
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  const handleEdit = (team: AgentTeam) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || "",
      leadAgentId: team.leadAgentId || "",
      agentIds: team.agentIds || [],
      color: team.color || "#0ea5e9",
      maxAgents: team.maxAgents || 5,
    });
    setShowForm(true);
    setMenuOpen(null);
  };

  const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || "Unknown";
  const getAgentAvatar = (id: string) => agents.find(a => a.id === id)?.avatar || "?";

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-fg-primary)]">Agent Teams</h1>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Organize agents into teams for collaborative workflows
              </p>
            </div>
            <button
              onClick={() => { setEditingTeam(null); setFormData({ name: "", description: "", leadAgentId: "", agentIds: [], color: "#0ea5e9", maxAgents: 5 }); setShowForm(true); }}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)]"
            >
              <Plus className="h-4 w-4" />
              Create Team
            </button>
          </div>

          {/* Teams Grid */}
          {loading ? (
            <div className="text-center py-12 text-[var(--color-fg-muted)]">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] py-16">
              <Users className="mb-4 h-12 w-12 text-[var(--color-fg-subtle)]" />
              <p className="text-lg font-medium text-[var(--color-fg-primary)]">No teams yet</p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Create your first team to organize agents</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="group relative rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-5 transition-all hover:border-[var(--color-accent)]/30"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: team.color || "var(--color-accent)" }}
                      >
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--color-fg-primary)]">{team.name}</h3>
                        <p className="text-xs text-[var(--color-fg-muted)]">{team.agentIds?.length || 0} agents</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === team.id ? null : team.id)}
                        className="rounded-lg p-1.5 text-[var(--color-fg-muted)] opacity-0 transition-opacity hover:bg-[rgba(255,255,255,0.06)] group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpen === team.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1 shadow-xl">
                          <button
                            onClick={() => handleEdit(team)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--color-fg-secondary)] hover:bg-[rgba(255,255,255,0.06)]"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(team.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-[rgba(255,255,255,0.06)]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-[var(--color-fg-muted)] line-clamp-2">{team.description || "No description"}</p>
                  
                  {/* Agent Avatars */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {(team.agentIds || []).slice(0, 4).map((agentId, i) => (
                        <div
                          key={agentId}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-bg-elevated)] bg-[var(--color-bg-base)] text-sm"
                          style={{ zIndex: 4 - i }}
                        >
                          {getAgentAvatar(agentId)}
                        </div>
                      ))}
                      {(team.agentIds || []).length > 4 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-bg-elevated)] bg-[var(--color-bg-base)] text-xs text-[var(--color-fg-muted)]">
                          +{(team.agentIds || []).length - 4}
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/chat?team=${team.id}`}
                      className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
                    >
                      Start Chat <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Add Team Card */}
              <button
                onClick={() => { setEditingTeam(null); setFormData({ name: "", description: "", leadAgentId: "", agentIds: [], color: "#0ea5e9", maxAgents: 5 }); setShowForm(true); }}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center transition-all hover:border-[var(--color-accent)]/50 hover:bg-[rgba(255,255,255,0.02)]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                  <Users className="h-6 w-6 text-[var(--color-accent)]" />
                </div>
                <p className="text-sm font-medium text-[var(--color-fg-primary)]">Create New Team</p>
                <p className="mt-1 text-xs text-[var(--color-fg-muted)]">Group agents together</p>
              </button>
            </div>
          )}

          {/* Team Form Modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-6 shadow-2xl">
                <h2 className="mb-4 text-lg font-semibold text-[var(--color-fg-primary)]">
                  {editingTeam ? "Edit Team" : "Create Team"}
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
                    <label className="mb-1 block text-sm text-[var(--color-fg-secondary)]">Color</label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 w-20 rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--color-fg-secondary)]">Select Agents</label>
                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] p-2">
                      {agents.length === 0 ? (
                        <p className="text-xs text-[var(--color-fg-muted)]">No agents available</p>
                      ) : (
                        agents.map((agent) => (
                          <label key={agent.id} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[rgba(255,255,255,0.06)]">
                            <input
                              type="checkbox"
                              checked={formData.agentIds.includes(agent.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, agentIds: [...formData.agentIds, agent.id] });
                                } else {
                                  setFormData({ ...formData, agentIds: formData.agentIds.filter(id => id !== agent.id) });
                                }
                              }}
                              className="h-4 w-4 rounded border-[var(--glass-border)]"
                            />
                            <span className="text-sm">{agent.avatar}</span>
                            <span className="text-sm text-[var(--color-fg-primary)]">{agent.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setEditingTeam(null); }}
                      className="rounded-lg px-4 py-2 text-sm text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
                    >
                      {editingTeam ? "Save Changes" : "Create Team"}
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
