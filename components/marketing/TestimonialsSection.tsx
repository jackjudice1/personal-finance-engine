const TESTIMONIALS = [
  {
    quote:
      "I've used three budgeting apps before this. None of them ever told me what to actually do — just showed me charts of money I already knew was gone.",
    name: "Priya S.",
    role: "Software engineer",
  },
  {
    quote:
      "The debt-vs-investing calculator settled an argument I'd been having with myself for a year. Paid off the card, invested the rest.",
    name: "Marcus T.",
    role: "Small business owner",
  },
  {
    quote:
      "Seeing my health score break down into four pieces made it click why I felt broke despite a decent salary. Cash flow was fine, debt was the problem.",
    name: "Elena R.",
    role: "Nurse practitioner",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">People feel different about money</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6">
              <blockquote className="text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-sm font-medium">
                {t.name}
                <span className="block text-xs font-normal text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
