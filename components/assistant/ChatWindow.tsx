"use client";

import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { ChatMessageBubble, type ChatMessage } from "@/components/assistant/ChatMessageBubble";
import { SuggestedPromptChips } from "@/components/assistant/SuggestedPromptChips";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Ask me anything about your money — \"Can I afford a Tesla?\", debt vs. investing, or how your financial health score breaks down.",
};

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(question: string) {
    if (!question.trim() || isSending) return;
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const body = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.ok ? body.answer : "Something went wrong — try rephrasing that." },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong — try again in a moment." }]);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight));
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-2xl flex-col rounded-xl border border-border/60 bg-card">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, i) => (
          <ChatMessageBubble key={i} message={message} />
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Thinking...
          </div>
        )}
      </div>
      <div className="space-y-3 border-t border-border/60 p-4">
        {messages.length <= 1 && <SuggestedPromptChips onSelect={send} />}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a purchase, debt, or your goals..."
          />
          <Button type="submit" size="icon" disabled={isSending || !input.trim()} aria-label="Send">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
