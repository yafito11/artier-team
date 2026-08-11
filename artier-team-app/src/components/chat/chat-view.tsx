"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Composer } from "@/components/composer/composer";
import { Message } from "@/components/chat/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { PanelLeft } from "lucide-react";

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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function ChatViewInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session");

  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null);
  const [selectedTeam, setSelectedTeam] = React.useState<AgentTeam | null>(null);
  const [selectedModel, setSelectedModel] = React.useState<AIModel>({
    id: "auto",
    name: "Auto",
    provider: "Smart routing",
  });
  const [effort, setEffort] = React.useState("high");
  const [dbMessages, setDbMessages] = React.useState<ChatMessage[]>([]);
  const [isLoadingSession, setIsLoadingSession] = React.useState(false);
  const currentSessionIdRef = React.useRef<string | null>(sessionId);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Load session messages
  React.useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    } else {
      setDbMessages([]);
      currentSessionIdRef.current = null;
    }
  }, [sessionId]);

  const loadSession = async (id: string) => {
    setIsLoadingSession(true);
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (res.ok) {
        const session = await res.json();
        setDbMessages(session.messages || []);
        currentSessionIdRef.current = id;
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const createSession = async (firstMessage: string): Promise<string | null> => {
    try {
      const title = firstMessage.substring(0, 50) + (firstMessage.length > 50 ? "..." : "");
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          modelId: selectedModel.id,
          agentId: selectedAgent?.id,
          teamId: selectedTeam?.id,
          messages: [],
        }),
      });
      if (res.ok) {
        const session = await res.json();
        router.push(`/chat?session=${session.id}`);
        return session.id;
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
    return null;
  };

  const saveMessages = async (id: string, msgs: ChatMessage[]) => {
    try {
      await fetch(`/api/sessions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  };

  const handleSend = async (content: string) => {
    if (isLoading) return;

    // Create session if first message
    let activeSessionId = currentSessionIdRef.current;
    if (!activeSessionId) {
      activeSessionId = await createSession(content);
      if (!activeSessionId) return;
      currentSessionIdRef.current = activeSessionId;
    }

    sendMessage({
      text: content,
    });
  };

  // Save messages when they change (after streaming completes)
  React.useEffect(() => {
    if (messages.length > 0 && status === "ready" && currentSessionIdRef.current) {
      const chatMsgs: ChatMessage[] = messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") || "",
      }));
      saveMessages(currentSessionIdRef.current, chatMsgs);
    }
  }, [messages, status]);

  const allMessages = React.useMemo(() => {
    const combined: Array<{ id: string; role: "user" | "assistant"; content: string; reasoning?: string }> = [];

    // Add DB messages
    for (const msg of dbMessages) {
      combined.push(msg);
    }

    // Add streaming messages
    for (const msg of messages) {
      const textParts = msg.parts?.filter((p: any) => p.type === "text") || [];
      const reasoningParts = msg.parts?.filter((p: any) => p.type === "reasoning") || [];
      const content = textParts.map((p: any) => p.text).join("");
      const reasoning = reasoningParts.map((p: any) => p.text).join("\n\n");

      if (content || reasoning) {
        combined.push({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content,
          reasoning: reasoning || undefined,
        });
      }
    }

    return combined;
  }, [dbMessages, messages]);

  if (isLoadingSession) {
    return (
      <div className="flex h-screen bg-[var(--color-bg-base)]">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-sm text-[var(--color-fg-muted)]">Memuat sesi...</div>
        </main>
      </div>
    );
  }

  if (allMessages.length === 0) {
    return (
      <div className="flex h-screen bg-[var(--color-bg-base)]">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex flex-1 flex-col overflow-hidden">
          {sidebarCollapsed && (
            <div className="absolute left-4 top-3 z-10">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-secondary)]"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-[800px] px-4">
              <h1 className="mb-8 text-center text-2xl font-semibold text-[var(--color-fg-primary)]">
                Saya siap kapan pun Anda siap.
              </h1>
              <Composer
                onSend={handleSend}
                selectedAgent={selectedAgent}
                onAgentSelect={setSelectedAgent}
                selectedTeam={selectedTeam}
                onTeamSelect={setSelectedTeam}
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
                effort={effort}
                onEffortChange={setEffort}
                isStreaming={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-fg-muted)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-fg-secondary)]"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center gap-2">
              {selectedAgent ? (
                <>
                  <span className="text-lg">{selectedAgent.avatar}</span>
                  <span className="text-sm font-medium text-[var(--color-fg-primary)]">{selectedAgent.name}</span>
                </>
              ) : selectedTeam ? (
                <>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedTeam.color }} />
                  <span className="text-sm font-medium text-[var(--color-fg-primary)]">{selectedTeam.name}</span>
                </>
              ) : (
                <span className="text-sm font-medium text-[var(--color-fg-primary)]">Chat</span>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[800px] py-4">
            {allMessages.map((msg) => (
              <div key={msg.id}>
                {msg.reasoning && (
                  <Reasoning className="px-4" isStreaming={isLoading}>
                    <ReasoningTrigger />
                    <ReasoningContent>{msg.reasoning}</ReasoningContent>
                  </Reasoning>
                )}
                <Message
                  role={msg.role}
                  content={msg.content}
                />
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.parts?.length === 0 && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-fg-muted)]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-fg-muted)]" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-fg-muted)]" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div className="h-4" />
          </div>
        </div>

        <Composer
          onSend={handleSend}
          selectedAgent={selectedAgent}
          onAgentSelect={setSelectedAgent}
          selectedTeam={selectedTeam}
          onTeamSelect={setSelectedTeam}
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
          effort={effort}
          onEffortChange={setEffort}
          isStreaming={isLoading}
        />
      </main>
    </div>
  );
}

export function ChatView() {
  return <ChatViewInner />;
}
