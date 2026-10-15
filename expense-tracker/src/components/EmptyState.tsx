import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { panelStyles } from "./ui";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className={clsx(panelStyles, "flex flex-col items-center px-6 py-14 text-center")}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/15 text-amber">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-base font-bold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {children && <div className="mt-6 flex flex-col gap-3 sm:flex-row">{children}</div>}
    </div>
  );
}
