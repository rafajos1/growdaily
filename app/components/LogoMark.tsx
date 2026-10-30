/**
 * GrowDaily's mark: three steps, with the amber dot hopping up them, step by
 * step. `bold` uses fewer, larger dots so the path still reads at icon sizes.
 */
export function LogoMark({ className = "h-7 w-7", bold = false }: { className?: string; bold?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <rect x="12" y="62" width="20" height="26" rx="4" fill="#e8eef5" opacity=".6" />
      <rect x="40" y="48" width="20" height="40" rx="4" fill="#e8eef5" opacity=".8" />
      <rect x="68" y="34" width="20" height="54" rx="4" fill="#e8eef5" />
      <path
        d="M22 54 Q36 30 50 40 Q64 18 78 24"
        fill="none"
        stroke="#f2b54b"
        strokeWidth={bold ? 6 : 3}
        strokeDasharray={bold ? "0.1 13" : "1 6"}
        strokeLinecap="round"
      />
      <circle cx="78" cy="20" r={bold ? 10 : 8} fill="#f2b54b" />
    </svg>
  );
}
