const SUGGESTED_QUESTIONS = [
  "Can I afford a new car?",
  "How much should I save each month?",
  "Am I overspending?",
  "How long until I reach my emergency fund goal?",
  "Should I pay off debt or invest?",
  "What happens if I get a $10,000 raise?",
  "Can I buy a house?",
  "What is hurting my finances most?",
  "How can I save $500/month?",
  "What subscriptions should I cancel?",
];

export function SuggestedQuestionChips({ onSelect }: { onSelect: (question: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTED_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
