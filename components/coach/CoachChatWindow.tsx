"use client";

import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import type { FinancialProfile } from "@/types/financial";
import type { HealthScoreBreakdown } from "@/types/engine";
import { useCoachChat } from "@/hooks/useCoachChat";
import { usePersonalityMode } from "@/components/dashboard/PersonalityModeProvider";
import { CoachSummaryGrid } from "@/components/coach/CoachSummaryGrid";
import { CoachMessageBubble } from "@/components/coach/CoachMessageBubble";
import { SuggestedQuestionChips } from "@/components/coach/SuggestedQuestionChips";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CoachChatWindow({ profile, health }: { profile: FinancialProfile; health: HealthScoreBreakdown }) {
  const { mode } = usePersonalityMode();
  const { messages, isSending, revealingMessage, send } = useCoachChat(mode);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleSend(question: string) {
    send(question);
    setInput("");
    requestAnimationFrame(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight));
  }

  const showIntro = messages.length <= 1 && !revealingMessage;

  return (
    <div className="space-y-5">
      {showIntro && <CoachSummaryGrid profile={profile} health={health} />}

      <div className="flex h-[calc(100vh-20rem)] min-h-[28rem] max-w-2xl flex-col rounded-xl border border-border/60 bg-card">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <CoachMessageBubble key={message.id} message={message} profile={profile} onSelectFollowUp={handleSend} />
          ))}
          {revealingMessage && <CoachMessageBubble message={revealingMessage} profile={profile} onSelectFollowUp={handleSend} />}
          {isSending && !revealingMessage && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Thinking...
            </div>
          )}
        </div>
        <div className="space-y-3 border-t border-border/60 p-4">
          {showIntro && <SuggestedQuestionChips onSelect={handleSend} />}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a purchase, debt, a goal, or a 'what if'..."
            />
            <Button type="submit" size="icon" disabled={isSending || !input.trim()} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
