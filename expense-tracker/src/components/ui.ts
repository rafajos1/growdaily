import clsx from "clsx";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";

export const buttonStyles = {
  primary: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-amber px-4 py-2.5 text-sm font-bold text-amber-ink transition hover:bg-amber-hover disabled:cursor-not-allowed disabled:opacity-60 ${focus}`,
  secondary: `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-[#2c4060] hover:bg-[#24364f] disabled:cursor-not-allowed disabled:opacity-60 ${focus}`,
  danger: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-up px-4 py-2.5 text-sm font-bold text-[#2a0d06] transition hover:brightness-110 disabled:opacity-60 ${focus}`,
  ghost: `inline-flex items-center justify-center rounded-lg p-2 text-muted transition hover:bg-raised hover:text-fg ${focus}`,
};

export function inputStyles(invalid?: boolean) {
  return clsx(
    "block w-full rounded-[10px] border bg-sunken px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:outline-none focus:ring-2",
    invalid ? "border-up focus:ring-up/40" : "border-line focus:border-amber focus:ring-amber/30",
  );
}

export const panelStyles = "rounded-2xl border border-line bg-panel";

/** Small uppercase mono label used above figures. */
export const eyebrowStyles = "font-mono text-xs uppercase tracking-[0.14em] text-muted";
