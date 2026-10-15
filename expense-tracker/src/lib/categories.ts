import {
  Car,
  Clapperboard,
  MoreHorizontal,
  Receipt,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "./types";

interface CategoryMeta {
  icon: LucideIcon;
  /** Category hue, tuned to read on the dark panels. */
  color: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Food: { icon: UtensilsCrossed, color: "#f2b54b" },
  Transportation: { icon: Car, color: "#5cb8e6" },
  Entertainment: { icon: Clapperboard, color: "#b48cf2" },
  Shopping: { icon: ShoppingBag, color: "#ef7fa8" },
  Bills: { icon: Receipt, color: "#53cfa0" },
  Other: { icon: MoreHorizontal, color: "#8796ab" },
};

/** Translucent fill of a category color, for chips and icon tiles. */
export function categoryTint(category: Category, alpha = "1f"): string {
  return CATEGORY_META[category].color + alpha;
}
