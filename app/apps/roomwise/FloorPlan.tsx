"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { clampRoom } from "../../../lib/roomwise/logic";
import { GRID_H, GRID_W, type Room } from "../../../lib/roomwise/types";

const U = 10; // SVG units per grid square

export type RoomState = { state: "free" | "busy" | "pending"; label: string };

/**
 * The building's floor plan. In view mode rooms are colored by what's happening;
 * in edit mode they can be dragged, resized from the corner, or nudged with arrow keys.
 */
export function FloorPlan({ rooms, mode, statusFor, selectedId, onSelect, onChange }: { rooms: Room[]; mode: "view" | "edit"; statusFor?: (room: Room) => RoomState; selectedId?: string | null; onSelect: (id: string) => void; onChange?: (room: Room) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ id: string; kind: "move" | "resize"; px: number; py: number; start: Room } | null>(null);
  const [live, setLive] = useState<Room | null>(null);

  const unitPx = () => (svgRef.current ? svgRef.current.getBoundingClientRect().width / GRID_W : 1);
  const begin = (e: PointerEvent, room: Room, kind: "move" | "resize") => {
    onSelect(room.id);
    if (mode !== "edit") return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDrag({ id: room.id, kind, px: e.clientX, py: e.clientY, start: room });
    setLive(room);
  };
  const move = (e: PointerEvent) => {
    if (!drag) return;
    const u = unitPx();
    const dx = Math.round((e.clientX - drag.px) / u);
    const dy = Math.round((e.clientY - drag.py) / u);
    const s = drag.start;
    setLive(clampRoom(drag.kind === "move" ? { ...s, x: s.x + dx, y: s.y + dy } : { ...s, w: s.w + dx, h: s.h + dy }));
  };
  const end = () => {
    if (drag && live && onChange && (live.x !== drag.start.x || live.y !== drag.start.y || live.w !== drag.start.w || live.h !== drag.start.h)) onChange(live);
    setDrag(null);
    setLive(null);
  };
  const key = (e: KeyboardEvent, room: Room) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(room.id);
      return;
    }
    if (mode !== "edit" || !onChange) return;
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!d) return;
    e.preventDefault();
    onChange(clampRoom(e.shiftKey ? { ...room, w: room.w + d[0], h: room.h + d[1] } : { ...room, x: room.x + d[0], y: room.y + d[1] }));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${GRID_W * U} ${GRID_H * U}`}
      className="block w-full touch-none select-none rounded-xl border border-line bg-sunken"
      role="group"
      aria-label={mode === "edit" ? "Floor plan editor" : "Floor plan"}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <defs>
        <pattern id="grid" width={U} height={U} patternUnits="userSpaceOnUse">
          <path d={`M ${U} 0 L 0 0 0 ${U}`} fill="none" stroke="#1b293b" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={GRID_W * U} height={GRID_H * U} fill="url(#grid)" />
      {rooms.map((original) => {
        const room = live && live.id === original.id ? live : original;
        const st = statusFor?.(room);
        const selected = room.id === selectedId;
        const fill = st?.state === "busy" ? "#f2846b" : st?.state === "pending" ? "#f2b54b" : room.color;
        const fillOpacity = st ? (st.state === "free" ? 0.12 : 0.35) : 0.22;
        const x = room.x * U;
        const y = room.y * U;
        const w = room.w * U;
        const h = room.h * U;
        const fontSize = Math.min(7, Math.max(3.6, w / Math.max(6, room.name.length) * 1.5));
        return (
          <g
            key={room.id}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={`${room.name}, seats ${room.capacity}${st ? `, ${st.label}` : ""}${mode === "edit" ? ". Arrow keys move it, Shift and arrow keys resize it." : ""}`}
            onPointerDown={(e) => begin(e, original, "move")}
            onKeyDown={(e) => key(e, original)}
            className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-[#e8eef5]"
            style={mode === "edit" ? { cursor: drag ? "grabbing" : "grab" } : undefined}
          >
            <rect x={x + 0.6} y={y + 0.6} width={w - 1.2} height={h - 1.2} rx="2" fill={fill} fillOpacity={fillOpacity} stroke={selected ? "#e8eef5" : st?.state === "busy" ? "#f2846b" : st?.state === "pending" ? "#f2b54b" : room.color} strokeWidth={selected ? 1.4 : 0.8} strokeDasharray={st?.state === "pending" ? "3 2" : undefined} />
            <text x={x + w / 2} y={y + h / 2 - (h > 26 ? fontSize * 0.4 : -fontSize * 0.35)} textAnchor="middle" fontSize={fontSize} fontWeight="700" fill="#e8eef5" fontFamily="var(--font-manrope), sans-serif" pointerEvents="none">
              {room.name}
            </text>
            {h > 26 && (
              <text x={x + w / 2} y={y + h / 2 + fontSize * 1.1} textAnchor="middle" fontSize={Math.max(3.2, fontSize * 0.75)} fill={st?.state === "busy" ? "#f9b8a8" : st?.state === "pending" ? "#f6c56d" : "#8a9bb2"} fontFamily="var(--font-manrope), sans-serif" pointerEvents="none">
                {st ? st.label : `${room.capacity} seats`}
              </text>
            )}
            {mode === "edit" && selected && (
              <rect x={x + w - 5} y={y + h - 5} width={5} height={5} rx="1" fill="#e8eef5" style={{ cursor: "nwse-resize" }} onPointerDown={(e) => begin(e, original, "resize")} aria-hidden />
            )}
          </g>
        );
      })}
    </svg>
  );
}
