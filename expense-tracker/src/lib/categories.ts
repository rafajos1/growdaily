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
  /** Hex color used in charts. */
  color: string;
  /** Tailwind classes for badges / icon chips. */
  badge: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Food: { icon: UtensilsCrossed, color: "#f59e0b", badge: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  Transportation: { icon: Car, color: "#0ea5e9", badge: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  Entertainment: { icon: Clapperboard, color: "#a855f7", badge: "bg-purple-50 text-purple-700 ring-purple-600/20" },
  Shopping: { icon: ShoppingBag, color: "#ec4899", badge: "bg-pink-50 text-pink-700 ring-pink-600/20" },
  Bills: { icon: Receipt, color: "#10b981", badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  Other: { icon: MoreHorizontal, color: "#64748b", badge: "bg-slate-100 text-slate-700 ring-slate-600/20" },
};
