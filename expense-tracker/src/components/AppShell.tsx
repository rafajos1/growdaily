"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, ListOrdered, Plus, Wallet } from "lucide-react";
import { useExpenseDialogs } from "./ExpenseDialogProvider";
import { StorageErrorBanner } from "./StorageErrorBanner";
import { buttonStyles } from "./ui";
import type { ReactNode } from "react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: ListOrdered },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { openCreate } = useExpenseDialogs();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="min-h-screen pb-24 sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
              <Wallet className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900">Spendwise</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={clsx(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive(href) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>

          <button type="button" onClick={openCreate} className={clsx(buttonStyles.primary, "hidden sm:inline-flex")}>
            <Plus className="h-4 w-4" aria-hidden />
            Add expense
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <StorageErrorBanner />
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Main mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <div className="grid h-16 grid-cols-3 items-center">
          <MobileLink {...NAV[0]} active={isActive(NAV[0].href)} />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={openCreate}
              aria-label="Add expense"
              className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition active:scale-95"
            >
              <Plus className="h-6 w-6" aria-hidden />
            </button>
          </div>
          <MobileLink {...NAV[1]} active={isActive(NAV[1].href)} />
        </div>
      </nav>
    </div>
  );
}

function MobileLink({ href, label, icon: Icon, active }: (typeof NAV)[number] & { active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx("flex flex-col items-center gap-1 text-xs font-medium", active ? "text-brand-600" : "text-slate-500")}
    >
      <Icon className="h-5 w-5" aria-hidden />
      {label}
    </Link>
  );
}
