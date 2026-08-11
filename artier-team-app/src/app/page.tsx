import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-cyan-400 text-2xl font-bold text-white">
          A
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Artier Team</h1>
        <p className="max-w-md text-[var(--color-fg-muted)]">
          Multi-Agent AI Platform — Build your own AI agent team with
          multi-provider support, sandbox execution, and automation.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-lg"
        >
          Open Chat
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-6 py-3 text-sm font-medium text-[var(--color-fg-secondary)] backdrop-blur-sm transition-all hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-fg-primary)]"
        >
          Manage Agents
        </Link>
      </div>

      <div className="mt-8 grid max-w-2xl grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div className="rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] p-4 text-center backdrop-blur-sm">
          <div className="mb-1 text-lg font-semibold text-[var(--color-accent)]">
            5
          </div>
          <div className="text-[var(--color-fg-muted)]">Agents</div>
        </div>
        <div className="rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] p-4 text-center backdrop-blur-sm">
          <div className="mb-1 text-lg font-semibold text-[var(--color-accent)]">
            2
          </div>
          <div className="text-[var(--color-fg-muted)]">Teams</div>
        </div>
        <div className="rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] p-4 text-center backdrop-blur-sm">
          <div className="mb-1 text-lg font-semibold text-[var(--color-accent)]">
            3
          </div>
          <div className="text-[var(--color-fg-muted)]">Skills</div>
        </div>
        <div className="rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] p-4 text-center backdrop-blur-sm">
          <div className="mb-1 text-lg font-semibold text-[var(--color-accent)]">
            2
          </div>
          <div className="text-[var(--color-fg-muted)]">Automations</div>
        </div>
      </div>
    </div>
  );
}
