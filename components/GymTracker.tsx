"use client";

import { useState, useTransition } from "react";
import { DAY_LABELS, dayDate, dateOnly, weekParamFor } from "@/lib/dates";
import { saveGymGoal, toggleGymSession } from "@/app/actions";
import { celebrateCompletion } from "@/lib/celebrate";

export default function GymTracker({
  weekOf,
  sessionDates,
  weeklyTarget,
}: {
  weekOf: Date;
  sessionDates: Date[];
  weeklyTarget: number;
}) {
  const [target, setTarget] = useState(weeklyTarget);
  const [, startTransition] = useTransition();
  const doneSet = new Set(sessionDates.map((d) => dateOnly(d).getTime()));
  const days = DAY_LABELS.map((label, i) => dayDate(weekOf, i));
  const count = days.filter((d) => doneSet.has(dateOnly(d).getTime())).length;
  const progress = target > 0 ? Math.min(1, count / target) : 0;

  function saveTarget(next: number) {
    const formData = new FormData();
    formData.set("weeklyTarget", String(next));
    startTransition(() => saveGymGoal(formData));
  }

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
          🏋️ Gym this week
        </h2>
        <span className="text-xs text-ink/40">{count}/{target} sessions</span>
      </div>
      <div className="flex gap-2">
        {days.map((d, i) => {
          const iso = weekParamFor(d);
          const done = doneSet.has(dateOnly(d).getTime());
          return (
            <button
              key={iso}
              onClick={() => {
                if (!done) celebrateCompletion();
                startTransition(() => toggleGymSession(iso));
              }}
              aria-label={`Toggle gym session for ${DAY_LABELS[i]}`}
              className={`flex-1 aspect-square rounded-lg border text-[10px] font-medium transition-all ${
                done
                  ? "bg-lavender border-lavender text-white scale-100"
                  : "border-ink/15 text-ink/30 hover:border-ink/30 hover:scale-105"
              }`}
            >
              {DAY_LABELS[i][0]}
            </button>
          );
        })}
      </div>

      <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-lavender transition-all"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-end gap-1 text-xs text-ink/40">
        <span>Goal:</span>
        <input
          type="number"
          min={1}
          max={7}
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          onBlur={() => saveTarget(target)}
          className="w-10 text-center bg-transparent focus:outline-none"
        />
        <span>sessions/week</span>
      </div>
    </div>
  );
}
