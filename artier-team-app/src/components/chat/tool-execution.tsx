"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Terminal, CheckCircle, XCircle, Loader2, Copy, Check } from "lucide-react";

interface ToolExecutionProps {
  command: string;
  output?: string;
  error?: string;
  status: "running" | "success" | "error";
  exitCode?: number;
  duration?: number;
}

export function ToolExecution({
  command,
  output,
  error,
  status,
  exitCode,
  duration,
}: ToolExecutionProps) {
  const [copied, setCopied] = React.useState(false);
  const [expanded, setExpanded] = React.useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(output || error || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-lg border border-[var(--glass-border)] bg-[var(--color-bg-muted)] overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[rgba(255,255,255,0.02)]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[var(--color-fg-muted)]" />
          <span className="text-xs font-medium text-[var(--color-fg-primary)]">Command Execution</span>
          {status === "running" && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-accent)]" />
          )}
          {status === "success" && (
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
          )}
          {status === "error" && (
            <XCircle className="h-3.5 w-3.5 text-red-400" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {duration !== undefined && (
            <span className="text-[10px] text-[var(--color-fg-subtle)]">
              {(duration / 1000).toFixed(2)}s
            </span>
          )}
          {exitCode !== undefined && (
            <span className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-mono",
              exitCode === 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            )}>
              exit {exitCode}
            </span>
          )}
        </div>
      </div>

      {/* Command */}
      <div className="border-t border-[var(--glass-border)] bg-[var(--color-bg-overlay)] px-3 py-2">
        <code className="text-xs text-[var(--color-accent)]">{command}</code>
      </div>

      {/* Output */}
      {expanded && (output || error) && (
        <div className="border-t border-[var(--glass-border)]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[rgba(255,255,255,0.02)]">
            <span className="text-[10px] font-semibold uppercase text-[var(--color-fg-subtle)]">
              {error ? "Error" : "Output"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="flex items-center gap-1 text-[10px] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto px-3 py-2 text-xs text-[var(--color-fg-secondary)]">
            {output || error}
          </pre>
        </div>
      )}
    </div>
  );
}
