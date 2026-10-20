export { Modal, panel, eyebrow } from "../habitwise/ui";

export const ACCENT = "#8fb3ff";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8fb3ff]";
export const btn = {
  primary: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#8fb3ff] px-4 py-2.5 text-sm font-bold text-[#0b1730] transition hover:brightness-110 disabled:opacity-60 ${focus}`,
  secondary: `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-[#24364f] disabled:opacity-60 ${focus}`,
  danger: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-up px-4 py-2.5 text-sm font-bold text-[#2a0d06] transition hover:brightness-110 ${focus}`,
  ghost: `inline-flex items-center justify-center rounded-lg p-2 text-muted transition hover:bg-raised hover:text-fg ${focus}`,
};
export const input = `w-full rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-base text-fg placeholder:text-dim ${focus}`;
export const label = "block text-sm font-semibold";

