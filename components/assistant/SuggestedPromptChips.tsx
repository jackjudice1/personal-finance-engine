const SUGGESTED_PROMPTS = [
  "Can I afford a $35,000 car at $550/month?",
  "Should I pay off debt or invest?",
  "How's my financial health?",
];

export function SuggestedPromptChips({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
