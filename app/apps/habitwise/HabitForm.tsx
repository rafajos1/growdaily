"use client";

import { useState, type FormEvent } from "react";
import { EVERY_DAY, HABIT_COLORS, WEEKDAYS, type Habit } from "../../../lib/habitwise/types";
import { btn } from "./ui";

export interface HabitDraft {
  name: string;
  color: string;
  days: number[];
}

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MAX_NAME = 40;

export function HabitForm({ initial, onSubmit, onCancel }: { initial?: Habit; onSubmit: (d: HabitDraft) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? HABIT_COLORS[0]);
  const [days, setDays] = useState<number[]>(initial?.days ?? EVERY_DAY);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError("Give the habit a name.");
    if (trimmed.length > MAX_NAME) return setError(`Keep the name under ${MAX_NAME} characters.`);
    if (days.length === 0) return setError("Pick at least one day.");
    onSubmit({ name: trimmed, color, days: [...days].sort() });
  };

  const preset = (d: number[]) => setDays(d);
  const same = (a: number[], b: number[]) => [...a].sort().join() === [...b].sort().join();

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <label htmlFor="habit-name" className="mb-1.5 block text-sm font-semibold text-soft">
          Habit
        </label>
        <input
          id="habit-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="e.g. Walk 10,000 steps"
          maxLength={60}
          className="block w-full rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:border-down focus:outline-none focus:ring-2 focus:ring-down/30"
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-soft">Which days?</legend>
        <div className="mb-2 flex flex-wrap gap-2">
          {[
            { label: "Every day", d: EVERY_DAY },
            { label: "Weekdays", d: WEEKDAYS },
            { label: "Weekends", d: [0, 6] },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={same(days, p.d)}
              onClick={() => preset(p.d)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${same(days, p.d) ? "border-down bg-down/15 text-fg" : "border-line text-soft hover:border-[#2c4060]"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {DAY_LETTERS.map((l, i) => {
            const on = days.includes(i);
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                aria-label={DAY_LABELS[i]}
                onClick={() => setDays(on ? days.filter((d) => d !== i) : [...days, i])}
                className={`rounded-[10px] border py-2.5 font-mono text-sm transition ${on ? "border-down bg-down/15 text-fg" : "border-line bg-sunken text-muted"}`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-soft">Color</legend>
        <div className="flex gap-2.5">
          {HABIT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full transition ${color === c ? "ring-2 ring-fg ring-offset-2 ring-offset-panel" : ""}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm font-semibold text-up">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={btn.secondary}>
          Cancel
        </button>
        <button type="submit" className={btn.primary}>
          {initial ? "Save changes" : "Add habit"}
        </button>
      </div>
    </form>
  );
}
