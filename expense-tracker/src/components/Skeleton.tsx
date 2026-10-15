import clsx from "clsx";
import { cardStyles } from "./ui";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-md bg-slate-200/70", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={clsx(cardStyles, "p-5")}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-32" />
            <Skeleton className="mt-3 h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className={clsx(cardStyles, "p-6 lg:col-span-3")}>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-6 h-64 w-full" />
        </div>
        <div className={clsx(cardStyles, "p-6 lg:col-span-2")}>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mx-auto mt-6 h-48 w-48 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading expenses" className={clsx(cardStyles, "divide-y divide-slate-100")}>
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
