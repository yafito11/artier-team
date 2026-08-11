"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Plus,
  Send,
  Mic,
  Bot,
  Code,
  Zap,
  Paperclip,
  Image as ImageIcon,
  ChevronDown,
  Check,
  X,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  color: string;
  modelId: string;
  systemPrompt?: string;
}

interface AgentTeam {
  id: string;
  name: string;
  agentIds: string[];
  color: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
}

interface ComposerProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  selectedAgent?: Agent | null;
  onAgentSelect?: (agent: Agent | null) => void;
  selectedTeam?: AgentTeam | null;
  onTeamSelect?: (team: AgentTeam | null) => void;
  selectedModel?: AIModel;
  onModelSelect?: (model: AIModel) => void;
  effort?: string;
  onEffortChange?: (effort: string) => void;
  isStreaming?: boolean;
}

const AI_MODELS: AIModel[] = [
  { id: "auto", name: "Auto", provider: "Smart routing" },
  { id: "stepfun-3.7-flash", name: "StepFun 3.7 Flash", provider: "Bynara" },
  { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", provider: "Anthropic" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
];

const EFFORT_LEVELS = [
  { id: "low", name: "Low", description: "Fast, basic responses" },
  { id: "medium", name: "Medium", description: "Balanced speed and quality" },
  { id: "high", name: "High", description: "Best quality, slower" },
];

const ATTACH_OPTIONS = [
  { id: "agent", icon: Bot, label: "Agent", description: "Invoke an AI agent" },
  { id: "command", icon: Code, label: "Command", description: "Run a command" },
  { id: "skill", icon: Zap, label: "Skill", description: "Use a skill" },
  { id: "file", icon: Paperclip, label: "Attach Files", description: "Upload files" },
  { id: "image", icon: ImageIcon, label: "Image", description: "Upload an image" },
];

export function Composer({
  onSend,
  placeholder = "Ketik pesan...",
  disabled = false,
  selectedAgent,
  onAgentSelect,
  selectedTeam,
  onTeamSelect,
  selectedModel,
  onModelSelect,
  effort = "high",
  onEffortChange,
  isStreaming = false,
}: ComposerProps) {
  const [message, setMessage] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = React.useState(false);
  const [modelMenuOpen, setModelMenuOpen] = React.useState(false);
  const [teamMenuOpen, setTeamMenuOpen] = React.useState(false);
  const [agentMenuOpen, setAgentMenuOpen] = React.useState(false);
  const [effortMenuOpen, setEffortMenuOpen] = React.useState(false);
  const attachMenuRef = React.useRef<HTMLDivElement>(null);
  const modelMenuRef = React.useRef<HTMLDivElement>(null);
  const teamMenuRef = React.useRef<HTMLDivElement>(null);
  const agentMenuRef = React.useRef<HTMLDivElement>(null);
  const effortMenuRef = React.useRef<HTMLDivElement>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [teams, setTeams] = React.useState<AgentTeam[]>([]);

  React.useEffect(() => {
    fetch("/api/agents").then(r => r.json()).then(setAgents).catch(() => {});
    fetch("/api/teams").then(r => r.json()).then(setTeams).catch(() => {});
  }, []);

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setMessage((prev) => prev + (prev ? "\n" : "") + "[Voice message transcribed]");
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied");
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) setAttachMenuOpen(false);
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) setModelMenuOpen(false);
      if (teamMenuRef.current && !teamMenuRef.current.contains(e.target as Node)) setTeamMenuOpen(false);
      if (agentMenuRef.current && !agentMenuRef.current.contains(e.target as Node)) setAgentMenuOpen(false);
      if (effortMenuRef.current && !effortMenuRef.current.contains(e.target as Node)) setEffortMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentModel = selectedModel || AI_MODELS[0];
  const currentEffort = EFFORT_LEVELS.find((e) => e.id === effort) || EFFORT_LEVELS[2];

  return (
    <div className="w-full px-4 pb-4">
      <div className="mx-auto max-w-[800px]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-overlay)] p-3 transition-colors focus-within:border-[var(--color-fg-subtle)]">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={disabled || isStreaming}
            rows={1}
            className="w-full resize-none bg-transparent pb-2 pt-1 text-[16px] leading-relaxed text-[var(--color-fg-primary)] placeholder-[var(--color-fg-subtle)] focus:outline-none"
            style={{ height: "auto" }}
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="relative" ref={attachMenuRef}>
                <button
                  onClick={() => setAttachMenuOpen(!attachMenuOpen)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    attachMenuOpen
                      ? "bg-[rgba(255,255,255,0.1)] text-[var(--color-fg-primary)]"
                      : "text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
                  )}
                >
                  <Plus className="h-5 w-5" />
                </button>

                {attachMenuOpen && (
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-52 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-xl">
                    {ATTACH_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAttachMenuOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                      >
                        <opt.icon className="h-4 w-4 shrink-0 text-[var(--color-fg-muted)]" />
                        <span className="text-sm text-[var(--color-fg-primary)]">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={agentMenuRef}>
                <button
                  onClick={() => setAgentMenuOpen(!agentMenuOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
                >
                  <span>{selectedAgent ? selectedAgent.avatar + " " + selectedAgent.name : "Agent"}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", agentMenuOpen && "rotate-180")} />
                </button>

                {agentMenuOpen && (
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-56 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-xl">
                    <button
                      onClick={() => { onAgentSelect?.(null); setAgentMenuOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      <span className="text-xs text-[var(--color-fg-muted)]">No Agent (Default)</span>
                      {!selectedAgent && <Check className="ml-auto h-3.5 w-3.5 text-[var(--color-accent)]" />}
                    </button>
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => { onAgentSelect?.(agent); setAgentMenuOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                      >
                        <span className="text-sm">{agent.avatar || "🤖"}</span>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-[var(--color-fg-primary)]">{agent.name}</div>
                          <div className="text-[10px] text-[var(--color-fg-subtle)]">{agent.modelId}</div>
                        </div>
                        {selectedAgent?.id === agent.id && <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={modelMenuRef}>
                <button
                  onClick={() => setModelMenuOpen(!modelMenuOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
                >
                  <span>{currentModel.name}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", modelMenuOpen && "rotate-180")} />
                </button>

                {modelMenuOpen && (
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-56 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-xl">
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => { onModelSelect?.(model); setModelMenuOpen(false); }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                      >
                        <div>
                          <div className="text-xs font-medium text-[var(--color-fg-primary)]">{model.name}</div>
                          <div className="text-[10px] text-[var(--color-fg-subtle)]">{model.provider}</div>
                        </div>
                        {currentModel.id === model.id && <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={teamMenuRef}>
                <button
                  onClick={() => setTeamMenuOpen(!teamMenuOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
                >
                  <span>{selectedTeam ? selectedTeam.name : "Team"}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", teamMenuOpen && "rotate-180")} />
                </button>

                {teamMenuOpen && (
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-56 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-xl">
                    <button
                      onClick={() => { onTeamSelect?.(null); setTeamMenuOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      <span className="text-xs text-[var(--color-fg-muted)]">No Team</span>
                      {!selectedTeam && <Check className="ml-auto h-3.5 w-3.5 text-[var(--color-accent)]" />}
                    </button>
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => { onTeamSelect?.(team); setTeamMenuOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: team.color || "var(--color-accent)" }} />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-[var(--color-fg-primary)]">{team.name}</div>
                          <div className="text-[10px] text-[var(--color-fg-subtle)]">{(team.agentIds || []).length} agents</div>
                        </div>
                        {selectedTeam?.id === team.id && <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={effortMenuRef}>
                <button
                  onClick={() => setEffortMenuOpen(!effortMenuOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
                >
                  <span className="text-[var(--color-accent)]">✦</span>
                  <span>{currentEffort.name}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", effortMenuOpen && "rotate-180")} />
                </button>

                {effortMenuOpen && (
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-52 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-xl">
                    {EFFORT_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => { onEffortChange?.(level.id); setEffortMenuOpen(false); }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                      >
                        <div>
                          <div className="text-xs font-medium text-[var(--color-fg-primary)]">{level.name}</div>
                          <div className="text-[10px] text-[var(--color-fg-subtle)]">{level.description}</div>
                        </div>
                        {effort === level.id && <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleRecording}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-primary)]"
                )}
              >
                {isRecording ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              <button
                onClick={handleSend}
                disabled={!message.trim() || isStreaming}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                  message.trim() && !isStreaming
                    ? "bg-[var(--color-fg-primary)] text-[var(--color-bg-base)] hover:opacity-90"
                    : "border border-[var(--color-border)] text-[var(--color-fg-disabled)]"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
