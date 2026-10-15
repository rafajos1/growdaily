import clsx from "clsx";
import { CATEGORY_META } from "@/lib/categories";
import type { Category } from "@/lib/types";

export function CategoryBadge({ category }: { category: Category }) {
  const { icon: Icon, badge } = CATEGORY_META[category];
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", badge)}>
      <Icon className="h-3 w-3" aria-hidden />
      {category}
    </span>
  );
}

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const { icon: Icon, badge } = CATEGORY_META[category];
  return (
    <span className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset", badge, className)}>
      <Icon className="h-5 w-5" aria-hidden />
    </span>
  );
}
