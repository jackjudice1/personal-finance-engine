import { Badge } from "@/components/ui/badge";
import { CATEGORY_META, type CoachCategory } from "@/types/coach";

export function CategoryBadge({ category }: { category: CoachCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <Badge variant="outline" className={`border-transparent ${meta.className}`}>
      {meta.label}
    </Badge>
  );
}
