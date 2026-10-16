"use client";

/** The on/off control for Faith, shared by the homepage, /faith and the apps. */
export function FaithSwitch({ on, onChange, labelledBy }: { on: boolean; onChange: (on: boolean) => void; labelledBy: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${on ? "border-amber bg-amber" : "border-line bg-sunken"}`}
    >
      <span className={`absolute top-0.5 h-[22px] w-[22px] rounded-full shadow transition-all ${on ? "left-[22px] bg-[#2a1c05]" : "left-0.5 bg-muted"}`} />
    </button>
  );
}
