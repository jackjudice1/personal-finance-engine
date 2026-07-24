"use client";

import { useEffect, useRef, useState } from "react";
import type { FinancialPersonality } from "@/types/database.types";
import type { ChatMessage } from "@/types/coach";

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Ask me anything about your money — affordability, debt vs. investing, your health score, or a \"what if\" scenario.",
};

/** Characters revealed per animation tick - tuned to read as a natural typing pace, not a slideshow. */
const REVEAL_CHARS_PER_TICK = 3;
const REVEAL_TICK_MS = 15;

interface PendingReveal {
  fullMessage: ChatMessage;
  revealedChars: number;
}

/**
 * Owns the coach chat's state machine: sending questions, receiving
 * deterministic responses from /api/assistant, and a simulated
 * word-by-word "typing" reveal (there's no real token stream to animate,
 * since the backend is the deterministic engine, not a live LLM).
 */
export function useCoachChat(personality: FinancialPersonality) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isSending, setIsSending] = useState(false);
  const [pendingReveal, setPendingReveal] = useState<PendingReveal | null>(null);
  const messageCounter = useRef(0);
  // React Strict Mode (on by default under the App Router) invokes state
  // updater functions twice in dev to catch impure ones - without this
  // guard, the setMessages side effect below would fire twice and push
  // the completed message into the list twice.
  const completedMessageIds = useRef(new Set<string>());

  useEffect(() => {
    if (!pendingReveal) return;
    const timer = setTimeout(() => {
      setPendingReveal((prev) => {
        if (!prev) return prev;
        const revealedChars = prev.revealedChars + REVEAL_CHARS_PER_TICK;
        if (revealedChars >= prev.fullMessage.content.length) {
          if (!completedMessageIds.current.has(prev.fullMessage.id)) {
            completedMessageIds.current.add(prev.fullMessage.id);
            setMessages((messages) => [...messages, prev.fullMessage]);
          }
          return null;
        }
        return { ...prev, revealedChars };
      });
    }, REVEAL_TICK_MS);
    return () => clearTimeout(timer);
  }, [pendingReveal]);

  async function send(question: string) {
    if (!question.trim() || isSending) return;
    messageCounter.current += 1;
    const userMessage: ChatMessage = { id: `user-${messageCounter.current}`, role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, personality }),
      });
      const body = await res.json();
      const assistantMessage: ChatMessage = res.ok
        ? body.message
        : { id: `error-${messageCounter.current}`, role: "assistant", content: "Something went wrong — try rephrasing that." };
      setPendingReveal({ fullMessage: assistantMessage, revealedChars: 0 });
    } catch {
      setPendingReveal({
        fullMessage: { id: `error-${messageCounter.current}`, role: "assistant", content: "Something went wrong — try again in a moment." },
        revealedChars: 0,
      });
    } finally {
      setIsSending(false);
    }
  }

  function clearChat() {
    setMessages([GREETING]);
    setPendingReveal(null);
  }

  const revealingMessage: ChatMessage | null = pendingReveal
    ? { ...pendingReveal.fullMessage, content: pendingReveal.fullMessage.content.slice(0, pendingReveal.revealedChars), category: undefined, decisionAnalysis: undefined, whatIfScenario: undefined, followUps: undefined }
    : null;

  return { messages, isSending, revealingMessage, send, clearChat };
}
