import clsx from "clsx";
import { panelStyles } from "./ui";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-md bg-raised", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={clsx(panelStyles, "p-6")}>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-4 h-14 w-56" />
          <Skeleton className="mt-4 h-4 w-3/4" />
          <Skeleton className="mt-8 h-44 w-full" />
        </div>
        <div className={clsx(panelStyles, "p-6")}>
          <Skeleton className="h-4 w-36" />
          <div className="mt-6 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }, (_, i) => (
              <Skeleton key={i} className="aspect-[1.25] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading expenses" className={clsx(panelStyles, "divide-y divide-hairline")}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/5" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}
