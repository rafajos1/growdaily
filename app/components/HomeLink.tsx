import Link from "next/link";
import { House } from "lucide-react";

/** A clear way back to the GrowDaily home page from any app or tool. */
export function HomeLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="GrowDaily home"
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-muted transition hover:bg-raised hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${className}`}
    >
      <House className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">Home</span>
    </Link>
  );
}
