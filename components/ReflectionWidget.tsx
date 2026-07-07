"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatFullDate } from "@/lib/dates";
import { saveDailyCheckIn } from "@/app/actions";

export default function ReflectionWidget({
  weekParam,
  dayParam,
  dayLabel,
  prevDayParam,
  nextDayParam,
  todayParam,
  isToday,
  note,
  reflectionCount,
}: {
  weekParam: string;
  dayParam: string;
  dayLabel: Date;
  prevDayParam: string;
  nextDayParam: string;
  todayParam: string;
  isToday: boolean;
  note: string;
  reflectionCount: number;
}) {
  const [value, setValue] = useState(note);
  const [justSaved, setJustSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function save() {
    const formData = new FormData();
    formData.set("date", dayParam);
    formData.set("note", value);
    startTransition(async () => {
      await saveDailyCheckIn(formData);
      setJustSaved(true);
    });
  }

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
          Reflection{" "}
          <span className="normal-case font-normal text-ink/30">
            · {reflectionCount} saved
          </span>
        </h2>
        <div className="flex items-center gap-2 text-xs text-ink/40">
          <Link
            href={`/?week=${weekParam}&day=${prevDayParam}`}
            className="hover:text-ink/70"
          >
            ←
          </Link>
          <span className="text-ink/70 font-medium">{formatFullDate(dayLabel)}</span>
          <Link
            href={`/?week=${weekParam}&day=${nextDayParam}`}
            className="hover:text-ink/70"
          >
            →
          </Link>
          {!isToday && (
            <Link
              href={`/?week=${weekParam}&day=${todayParam}`}
              className="hover:text-ink/70 underline"
            >
              Today
            </Link>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setJustSaved(false);
        }}
        rows={3}
        placeholder="No reflection for this day."
        className="w-full text-sm bg-transparent placeholder:text-ink/30 focus:outline-none resize-none"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={isPending}
          className="text-xs px-3 py-1.5 rounded-md bg-ink/90 text-white hover:bg-ink self-start disabled:opacity-50"
        >
          Save
        </button>
        {justSaved && !isPending && (
          <span className="text-xs text-ink/30">Saved</span>
        )}
      </div>
    </div>
  );
}
