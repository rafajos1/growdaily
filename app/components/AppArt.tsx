// Small decorative motifs for each app card, drawn in the app's own color.

export function SpendArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      <path d="M0 58 L30 56 L55 44 L80 44 L105 30 L130 30 L130 30" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M130 30 L220 12" fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      <path d="M0 60 L40 58 L70 50 L100 40 L140 26 L180 20 L220 8" fill="none" stroke="#4c6584" strokeWidth="2" opacity=".8" />
      <circle cx="130" cy="30" r="5" fill="#131e2c" stroke={color} strokeWidth="2.5" />
    </svg>
  );
}

export function HabitArt({ color }: { color: string }) {
  const filled = [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1];
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      {filled.map((on, i) => (
        <rect key={i} x={(i % 7) * 31 + 2} y={Math.floor(i / 7) * 21 + 2} width="26" height="17" rx="5" fill={color} opacity={on ? (i > 13 ? 1 : 0.55) : 0.12} />
      ))}
    </svg>
  );
}

export function PlanArt({ color }: { color: string }) {
  const blocks = [
    { x: 0, w: 70, o: 1 },
    { x: 76, w: 40, o: 0.55 },
    { x: 122, w: 58, o: 0.8 },
    { x: 186, w: 34, o: 0.35 },
  ];
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      {blocks.map((b, i) => (
        <rect key={i} x={b.x} y={i % 2 ? 30 : 10} width={b.w} height="22" rx="6" fill={color} opacity={b.o} />
      ))}
      <line x1="0" x2="220" y1="60" y2="60" stroke="#22324a" />
      {[0, 55, 110, 165, 219].map((x) => (
        <line key={x} x1={x} x2={x} y1="56" y2="60" stroke="#4c6584" />
      ))}
    </svg>
  );
}

export function MealArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      {[40, 110, 180].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="32" r="26" fill="none" stroke={color} strokeWidth="2" opacity={i === 1 ? 1 : 0.45} />
          <circle cx={cx} cy="32" r="16" fill={color} opacity={i === 1 ? 0.9 : 0.25} />
        </g>
      ))}
    </svg>
  );
}

export function MoodArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      <path d="M0 40 C 25 10, 45 10, 65 34 S 105 58, 125 30 S 170 6, 190 26 S 215 40, 220 34" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {[[65, 34], [125, 30], [190, 26]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4.5" fill={color} />
      ))}
    </svg>
  );
}
