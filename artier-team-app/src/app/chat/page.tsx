import { Suspense } from "react";
import { ChatView } from "@/components/chat/chat-view";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[var(--color-bg-base)]"><span className="text-sm text-[var(--color-fg-muted)]">Memuat...</span></div>}>
      <ChatView />
    </Suspense>
  );
}
