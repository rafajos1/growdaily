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

export function QuoteArt({ color }: { color: string }) {
  const rows = [52, 40, 60];
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      <rect x="1" y="1" width="104" height="62" rx="7" fill="#131e2c" stroke="#4c6584" strokeWidth="1.5" />
      {rows.map((w, i) => (
        <g key={i}>
          <rect x="10" y={9 + i * 11} width={w} height="5" rx="2.5" fill="#4c6584" opacity=".8" />
          <rect x="80" y={9 + i * 11} width="16" height="5" rx="2.5" fill={color} opacity=".55" />
        </g>
      ))}
      <rect x="10" y="46" width="86" height="9" rx="4.5" fill={color} />
      <path d="M116 32 H140" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M134 25 L142 32 L134 39" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="152" y="7" width="66" height="50" rx="7" fill="none" stroke={color} strokeWidth="2" opacity=".6" />
      <circle cx="185" cy="32" r="13" fill={color} opacity=".9" />
      <path d="M179 32 L184 37 L192 27" fill="none" stroke="#131e2c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CafeArt({ color }: { color: string }) {
  const stock = [44, 18, 50, 30, 12, 40, 24];
  const par = 30;
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      {stock.map((h, i) => {
        const low = h < par;
        return <rect key={i} x={i * 31 + 4} y={60 - h} width="22" height={h} rx="5" fill={low ? color : "#4c6584"} opacity={low ? 1 : 0.55} />;
      })}
      <line x1="0" x2="220" y1={60 - par} y2={60 - par} stroke={color} strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" />
      <line x1="0" x2="220" y1="61" y2="61" stroke="#22324a" />
    </svg>
  );
}

export function RoomArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      <rect x="1" y="1" width="218" height="62" rx="7" fill="none" stroke="#4c6584" strokeWidth="1.5" />
      <path d="M78 1 V40 M78 52 V63 M150 1 V63 M78 32 H150 M1 30 H44 M58 30 H78" stroke="#4c6584" strokeWidth="1.5" />
      <rect x="84" y="6" width="60" height="21" rx="4" fill={color} opacity=".9" />
      <rect x="156" y="6" width="57" height="52" rx="4" fill={color} opacity=".3" />
      <rect x="7" y="36" width="65" height="21" rx="4" fill={color} opacity=".55" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={170 + i * 14} cy="50" r="3.5" fill={color} />
      ))}
    </svg>
  );
}

export function PilotArt({ color }: { color: string }) {
  const pts: [number, number][] = [[10, 54], [62, 44], [114, 34], [166, 20]];
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      <path d={`M${pts.map((p) => p.join(" ")).join(" L")}`} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M166 20 L206 10" fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={x} cx={x} cy={y} r="5" fill={i < 3 ? color : "#131e2c"} stroke={color} strokeWidth="2.5" opacity={i < 3 ? 0.45 + i * 0.25 : 1} />
      ))}
      <path d="M206 30 V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M206 4 L218 8 L206 13 Z" fill={color} />
    </svg>
  );
}

export function ChurchArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 64" preserveAspectRatio="xMinYMid meet" className="h-16 w-full" aria-hidden>
      <rect x="2" y="4" width="120" height="22" rx="11" fill="#4c6584" opacity=".45" />
      <rect x="40" y="34" width="178" height="26" rx="13" fill={color} opacity=".22" />
      <rect x="40" y="34" width="4" height="26" rx="2" fill={color} />
      <path d="M54 42 h18 M54 50 h46" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M110 42 h60 M110 50 h90" stroke={color} strokeWidth="3" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}
