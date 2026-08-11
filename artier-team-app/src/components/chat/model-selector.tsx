"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

const MODELS = [
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google" },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek" },
];

export function ModelSelector() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(MODELS[0]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[var(--color-fg-secondary)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-fg-primary)]"
      >
        <span>{selected.name}</span>
        <ChevronDown className={cn("h-4 w-4 text-[var(--color-fg-subtle)] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1 shadow-xl">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                setSelected(model);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[rgba(255,255,255,0.06)]"
            >
              <div>
                <div className="text-[var(--color-fg-primary)]">{model.name}</div>
                <div className="text-xs text-[var(--color-fg-muted)]">{model.provider}</div>
              </div>
              {selected.id === model.id && <Check className="h-4 w-4 text-[var(--color-accent)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
