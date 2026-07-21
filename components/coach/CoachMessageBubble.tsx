import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { ChatMessage } from "@/types/coach";
import type { FinancialProfile } from "@/types/financial";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "@/components/coach/CategoryBadge";
import { DecisionAnalysisCard } from "@/components/coach/DecisionAnalysisCard";
import { WhatIfScenarioCard } from "@/components/coach/WhatIfScenarioCard";
import { FollowUpChips } from "@/components/coach/FollowUpChips";

const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-0.5 pl-4 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-0.5 pl-4 last:mb-0">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold tabular-nums">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/50 pl-3 text-muted-foreground">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-border/60 px-2 py-1 text-left font-medium">{children}</th>,
  td: ({ children }) => <td className="border-b border-border/40 px-2 py-1 tabular-nums">{children}</td>,
};

export function CoachMessageBubble({
  message,
  profile,
  onSelectFollowUp,
}: {
  message: ChatMessage;
  profile: FinancialProfile | null;
  onSelectFollowUp: (question: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
      </div>
      <div className={cn("max-w-[85%] space-y-2", isUser && "flex flex-col items-end")}>
        {!isUser && message.category && <CategoryBadge category={message.category} />}
        <div
          className={cn(
            "max-w-full rounded-2xl px-3.5 py-2 text-sm",
            isUser ? "bg-secondary text-secondary-foreground" : "bg-card ring-1 ring-foreground/10"
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
            {message.content}
          </ReactMarkdown>
        </div>
        {!isUser && message.decisionAnalysis && <DecisionAnalysisCard analysis={message.decisionAnalysis} />}
        {!isUser && message.whatIfScenario && profile && (
          <WhatIfScenarioCard scenario={message.whatIfScenario} profile={profile} />
        )}
        {!isUser && message.followUps && <FollowUpChips suggestions={message.followUps} onSelect={onSelectFollowUp} />}
      </div>
    </div>
  );
}
