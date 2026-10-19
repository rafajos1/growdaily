"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CalendarDays, House, ListOrdered, Plus, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { useExpenseDialogs } from "./ExpenseDialogProvider";
import { FaithToggle } from "./FaithToggle";
import { useToast } from "./ToastProvider";
import { useFaith } from "@/hooks/useFaith";
import { StorageErrorBanner } from "./StorageErrorBanner";
import { buttonStyles } from "./ui";

const NAV = [
  { href: "/", label: "This month", icon: CalendarDays },
  { href: "/expenses", label: "Expenses", icon: ListOrdered },
  { href: "/trends", label: "Trends", icon: TrendingUp },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { openCreate } = useExpenseDialogs();
  const { toast } = useToast();
  const [faith, setFaith] = useFaith();
  const changeFaith = (on: boolean) => {
    setFaith(on);
    toast("info", on ? "Faith is on. This month now shows a generosity view." : "Faith is off.");
  };
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="min-h-screen pb-24 sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-hairline bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* A plain link on purpose: in-app links are hash routes, and this one leaves for the GrowDaily home page. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              aria-label="GrowDaily home"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-muted transition hover:bg-raised hover:text-fg"
            >
              <House className="h-5 w-5" aria-hidden />
              <span className="hidden sm:inline">Home</span>
            </a>
            <Link href="/" className="flex items-center gap-2.5 rounded-lg text-xl font-extrabold tracking-tight">
              <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
              Spendwise
            </Link>
          </div>

          <nav aria-label="Main" className="hidden gap-1 rounded-[10px] border border-line bg-panel p-1 sm:flex">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={clsx(
                  "rounded-[7px] px-3.5 py-1.5 text-sm font-semibold transition",
                  isActive(href) ? "bg-raised text-fg" : "text-muted hover:text-fg",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <FaithToggle on={faith} onChange={changeFaith} />
            <button type="button" onClick={openCreate} className={clsx(buttonStyles.primary, "hidden sm:inline-flex")}>
              <Plus className="h-4 w-4" aria-hidden />
              Add expense
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <StorageErrorBanner />
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Main mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <div className="grid h-16 grid-cols-4 items-center">
          <MobileLink {...NAV[0]} active={isActive(NAV[0].href)} />
          <MobileLink {...NAV[1]} active={isActive(NAV[1].href)} />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={openCreate}
              aria-label="Add expense"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-amber-ink shadow-lg shadow-black/40 transition active:scale-95"
            >
              <Plus className="h-6 w-6" aria-hidden />
            </button>
          </div>
          <MobileLink {...NAV[2]} active={isActive(NAV[2].href)} />
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
      className={clsx("flex flex-col items-center gap-1 text-[11px] font-semibold", active ? "text-amber" : "text-muted")}
    >
      <Icon className="h-5 w-5" aria-hidden />
      {label}
    </Link>
  );
}
