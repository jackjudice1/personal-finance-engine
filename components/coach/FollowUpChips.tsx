export function FollowUpChips({ suggestions, onSelect }: { suggestions: string[]; onSelect: (suggestion: string) => void }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground transition-colors hover:bg-primary/15 hover:text-primary"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
