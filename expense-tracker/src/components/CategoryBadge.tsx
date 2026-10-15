import clsx from "clsx";
import { CATEGORY_META, categoryTint } from "@/lib/categories";
import type { Category } from "@/lib/types";

export function CategoryBadge({ category }: { category: Category }) {
  const { icon: Icon, color } = CATEGORY_META[category];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ color, background: categoryTint(category) }}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {category}
    </span>
  );
}

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const { icon: Icon, color } = CATEGORY_META[category];
  return (
    <span
      className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", className)}
      style={{ color, background: categoryTint(category, "1a") }}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </span>
  );
}

export function CategoryDot({ category }: { category: Category }) {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: CATEGORY_META[category].color }} aria-hidden />;
}
