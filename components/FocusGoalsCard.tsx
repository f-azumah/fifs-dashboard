"use client";

import { useState, useTransition } from "react";
import type { WeeklyGoal, WeeklyReflection } from "@prisma/client";
import { formatMonthDay } from "@/lib/dates";
import { saveWeeklyFocus } from "@/app/actions";
import WeeklyGoals from "@/components/WeeklyGoals";
import FloralDecoration from "@/components/FloralDecoration";

export default function FocusGoalsCard({
  weekOf,
  weekParam,
  reflection,
  goals,
}: {
  weekOf: Date;
  weekParam: string;
  reflection: WeeklyReflection | null;
  goals: WeeklyGoal[];
}) {
  const [focus, setFocus] = useState(reflection?.focus ?? "");
  const [, startTransition] = useTransition();

  function save() {
    const formData = new FormData();
    formData.set("weekOf", weekParam);
    formData.set("focus", focus);
    startTransition(() => saveWeeklyFocus(formData));
  }

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-3">
      <div className="group relative overflow-hidden rounded-md -m-1 p-3 flex flex-col gap-1">
        <FloralDecoration className="absolute top-1 right-3 w-24 h-24 opacity-45 pointer-events-none rotate-12 transition-transform duration-700 group-hover:animate-spin-slow" />
        <FloralDecoration
          className="absolute bottom-1 left-4 w-14 h-14 opacity-40 pointer-events-none -rotate-12 transition-transform duration-700 group-hover:animate-spin-slower"
          petalColor="#7FB2A6"
          centerColor="#ADA0CB"
        />
        <FloralDecoration className="absolute top-3 left-1/3 w-8 h-8 opacity-25 pointer-events-none rotate-45 transition-transform duration-700 group-hover:animate-spin-slow-reverse" />
        <FloralDecoration
          className="absolute bottom-2 right-1/4 w-10 h-10 opacity-30 pointer-events-none rotate-[30deg] transition-transform duration-700 group-hover:animate-spin-slow"
          petalColor="#7FB2A6"
          centerColor="#ADA0CB"
        />
        <h2 className="relative text-xs font-semibold uppercase tracking-wide text-ink/40">
          Week of {formatMonthDay(weekOf)}
        </h2>
        <textarea
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          onBlur={save}
          placeholder="Click to set this week's focus…"
          rows={2}
          className="relative w-full text-sm bg-transparent placeholder:text-ink/30 focus:outline-none resize-none"
        />
      </div>
      <WeeklyGoals weekParam={weekParam} goals={goals} />
    </div>
  );
}
