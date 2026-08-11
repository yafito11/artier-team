"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";

interface MessageProps {
  role: "user" | "assistant" | "system";
  content: string;
}

export function Message({ role, content }: MessageProps) {
  const [copied, setCopied] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <div
      className={cn(
        "group px-4 py-3",
        role === "user" ? "flex justify-end" : "flex justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {role === "user" ? (
        <div className="max-w-[85%]">
          <div className="rounded-2xl bg-[var(--color-bg-surface)] px-4 py-2.5 text-[15px] leading-relaxed text-[var(--color-fg-primary)]">
            {content}
          </div>
        </div>
      ) : (
        <div className="max-w-[85%]">
          <div className="text-[15px] leading-relaxed text-[var(--color-fg-primary)]">
            {content}
          </div>
          {showActions && (
            <div className="mt-1.5 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md p-1.5 text-[var(--color-fg-subtle)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-secondary)]"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button className="flex items-center gap-1 rounded-md p-1.5 text-[var(--color-fg-subtle)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-secondary)]">
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button className="flex items-center gap-1 rounded-md p-1.5 text-[var(--color-fg-subtle)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-secondary)]">
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
