"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Users,
  Bot,
  Zap,
  Settings,
  CalendarClock,
  ChevronDown,
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

interface TaskSession {
  id: string;
  title: string;
  createdAt: string;
}

const NAV_ITEMS = [
  { label: "Agents", href: "/agents", icon: "bot" as const },
  { label: "Teams", href: "/teams", icon: "users" as const },
  { label: "Skills", href: "/skills", icon: "zap" as const },
  { label: "Automations", href: "/automations", icon: "clock" as const },
];

const NavIcon = ({ icon, className }: { icon: string; className?: string }) => {
  switch (icon) {
    case "bot": return <Bot className={className} />;
    case "users": return <Users className={className} />;
    case "zap": return <Zap className={className} />;
    case "clock": return <CalendarClock className={className} />;
    default: return null;
  }
};

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({});
  const [mode, setMode] = React.useState<"chat" | "task">("chat");
  const [chatSessions, setChatSessions] = React.useState<ChatSession[]>([]);
  const [taskSessions, setTaskSessions] = React.useState<TaskSession[]>([]);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setChatSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Hapus sesi ini?")) return;

    try {
      await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      fetchSessions();
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes}m lalu`;
    if (hours < 24) return `${hours}j lalu`;
    if (days < 7) return `${days}h lalu`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <aside
      className={cn(
        "group/sidebar relative flex h-full flex-col border-r border-[var(--glass-border)]",
        "bg-gradient-to-b from-[rgba(14,165,233,0.06)] to-[rgba(14,165,233,0.01)]",
        "backdrop-blur-[20px] transition-all duration-200",
        collapsed ? "w-[56px]" : "w-[260px]"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "absolute -right-3 top-3 z-30 flex h-6 w-6 items-center justify-center rounded-full",
          "border border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
          "opacity-0 transition-opacity hover:bg-[var(--color-bg-hover)]",
          "group-hover/sidebar:opacity-100",
          collapsed && "opacity-100"
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-3.5 w-3.5 text-[var(--color-fg-muted)]" />
        ) : (
          <PanelLeftClose className="h-3.5 w-3.5 text-[var(--color-fg-muted)]" />
        )}
      </button>

      <div className="flex items-center border-b border-[var(--glass-border)] p-3">
        <Link
          href="/"
          className={cn(
            "flex flex-1 items-center gap-2 rounded-lg p-2 text-sm font-medium",
            "text-[var(--color-fg-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
          )}
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[var(--color-accent)] to-cyan-400 text-[10px] font-bold text-white">
            A
          </div>
          {!collapsed && <span>Artier Team</span>}
        </Link>
      </div>

      {!collapsed && (
        <div className="p-2 px-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
            <input
              type="text"
              placeholder="Cari..."
              className="w-full rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] py-2 pl-9 pr-3 text-sm text-[var(--color-fg-primary)] placeholder-[var(--color-fg-subtle)] backdrop-blur-sm transition-colors focus:border-[var(--color-accent)] focus:bg-[rgba(255,255,255,0.06)] focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className={cn("mx-3 my-2 flex rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] p-0.5", collapsed && "mx-1")}>
        <button
          onClick={() => setMode("chat")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "chat"
              ? "bg-[rgba(255,255,255,0.08)] text-[var(--color-fg-primary)]"
              : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-secondary)]"
          )}
        >
          {collapsed ? <MessageSquare className="mx-auto h-3.5 w-3.5" /> : "Chat"}
        </button>
        <button
          onClick={() => setMode("task")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "task"
              ? "bg-[rgba(255,255,255,0.08)] text-[var(--color-fg-primary)]"
              : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-secondary)]"
          )}
        >
          {collapsed ? <Zap className="mx-auto h-3.5 w-3.5" /> : "Task"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-1 py-2">
        <Link
          href="/chat"
          className={cn(
            "mb-2 flex items-center gap-2 rounded-lg p-2 text-sm font-medium",
            "bg-[var(--color-accent)] text-white transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-lg",
            collapsed && "justify-center px-2"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Chat Baru</span>}
        </Link>

        <div className="mb-1">
          <button
            onClick={() => toggleDropdown("chats")}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-fg-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]",
              collapsed && "justify-center px-2"
            )}
          >
            <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Sesi Chat</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-[var(--color-fg-subtle)] transition-transform",
                    openDropdowns["chats"] && "rotate-180"
                  )}
                />
              </>
            )}
          </button>
          {!collapsed && openDropdowns["chats"] && (
            <div className="max-h-[300px] overflow-y-auto">
              {chatSessions.length === 0 ? (
                <p className="py-2 pl-11 pr-3 text-xs text-[var(--color-fg-subtle)]">Belum ada sesi</p>
              ) : (
                chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className="group/session flex items-center"
                    onMouseEnter={() => setHoveredItem(session.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={`/chat?session=${session.id}`}
                      className="flex flex-1 items-center gap-2 border-none bg-transparent py-2 pl-11 pr-2 text-left font-[inherit] text-sm text-[var(--color-fg-muted)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
                    >
                      <span className="flex-1 truncate">{session.title}</span>
                      <span className="shrink-0 text-xs text-[var(--color-fg-subtle)]">{formatTime(session.createdAt)}</span>
                    </Link>
                    {hoveredItem === session.id && (
                      <button
                        onClick={(e) => handleDelete(session.id, e)}
                        className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-fg-subtle)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mb-1">
          <button
            onClick={() => toggleDropdown("tasks")}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-fg-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]",
              collapsed && "justify-center px-2"
            )}
          >
            <Zap className="h-4 w-4 shrink-0 opacity-60" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Sesi Task</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-[var(--color-fg-subtle)] transition-transform",
                    openDropdowns["tasks"] && "rotate-180"
                  )}
                />
              </>
            )}
          </button>
          {!collapsed && openDropdowns["tasks"] && (
            <div className="max-h-[300px] overflow-y-auto">
              {taskSessions.length === 0 ? (
                <p className="py-2 pl-11 pr-3 text-xs text-[var(--color-fg-subtle)]">Belum ada sesi</p>
              ) : (
                taskSessions.map((session) => (
                  <div
                    key={session.id}
                    className="group/session flex items-center"
                    onMouseEnter={() => setHoveredItem(`task-${session.id}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      className="flex flex-1 items-center gap-2 border-none bg-transparent py-2 pl-11 pr-2 text-left font-[inherit] text-sm text-[var(--color-fg-muted)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
                    >
                      <span className="flex-1 truncate">{session.title}</span>
                      <span className="shrink-0 text-xs text-[var(--color-fg-subtle)]">{formatTime(session.createdAt)}</span>
                    </button>
                    {hoveredItem === `task-${session.id}` && (
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-fg-subtle)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mb-1 mt-2 border-t border-[var(--glass-border)] pt-2">
          <div className={cn("mb-1 flex items-center justify-between px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]", collapsed && "justify-center px-2")}>
            {!collapsed && <span>Navigasi</span>}
          </div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-fg-secondary)] no-underline transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]",
                pathname === item.href && "bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)]",
                collapsed && "justify-center px-2"
              )}
            >
              <NavIcon icon={item.icon} className={cn("h-4 w-4 shrink-0 opacity-60", pathname === item.href && "opacity-100")} />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-2 border-t border-[var(--glass-border)] pt-2">
          <Link
            href="/settings/providers"
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-fg-secondary)] no-underline transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]",
              pathname === "/settings/providers" && "bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)]",
              collapsed && "justify-center px-2"
            )}
          >
            <Settings className="h-4 w-4 shrink-0 opacity-60" />
            {!collapsed && <span>Pengaturan</span>}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--glass-border)] p-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-muted)] text-xs font-semibold text-[var(--color-accent)]">
          U
        </div>
        {!collapsed && <span className="flex-1 text-sm text-[var(--color-fg-secondary)]">User</span>}
      </div>
    </aside>
  );
}
