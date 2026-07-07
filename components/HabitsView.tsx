"use client";

import Link from "next/link";
import { useState } from "react";
import type { Habit, HabitLog } from "@prisma/client";
import { CATEGORY_ORDER, CATEGORY_LABELS, CATEGORY_COLORS, habitColorFor } from "@/lib/habitMeta";
import { dateOnly, formatMonthDay } from "@/lib/dates";
import HabitGrid from "@/components/HabitGrid";
import IntervalHabitCard from "@/components/IntervalHabitCard";
import AddHabitForm from "@/components/AddHabitForm";

type HabitWithLogs = Habit & { logs: HabitLog[] };

export default function HabitsView({
  weekOf,
  weekParam,
  weekLabel,
  prevWeekParam,
  nextWeekParam,
  habits,
  latestIntervalLogs,
}: {
  weekOf: Date;
  weekParam: string;
  weekLabel: string;
  prevWeekParam: string;
  nextWeekParam: string;
  habits: HabitWithLogs[];
  latestIntervalLogs: Record<string, Date>;
}) {
  const [showAdd, setShowAdd] = useState(false);

  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    habits: habits.filter((h) => h.category === category),
  })).filter((group) => group.habits.length > 0);

  const scorableHabits = habits.filter(
    (h) => h.frequency === "DAILY" || h.frequency === "WEEKLY_TARGET"
  );
  const totalTarget = scorableHabits.reduce(
    (sum, h) => sum + (h.frequency === "WEEKLY_TARGET" ? h.weeklyTarget ?? 7 : 7),
    0
  );
  const totalDone = scorableHabits.reduce((sum, h) => {
    const completedDates = new Set(h.logs.map((log) => dateOnly(log.date).getTime()));
    return sum + completedDates.size;
  }, 0);
  const progress = totalTarget > 0 ? totalDone / totalTarget : 0;

  const habitColors: Record<string, string> = {};
  habits.forEach((h, i) => {
    habitColors[h.id] = habitColorFor(h.id, i, h.color);
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/habits?week=${prevWeekParam}`}
            className="px-2 py-1 rounded-md text-sm hover:bg-ink/5"
          >
            ← Prev
          </Link>
          <h1 className="text-lg font-semibold min-w-[220px] text-center">
            {weekLabel}
          </h1>
          <Link
            href={`/habits?week=${nextWeekParam}`}
            className="px-2 py-1 rounded-md text-sm hover:bg-ink/5"
          >
            Next →
          </Link>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="text-sm px-3 py-1.5 rounded-md bg-ink/90 text-white hover:bg-ink"
        >
          {showAdd ? "Close" : "+ Add habit"}
        </button>
      </div>

      {showAdd && <AddHabitForm onDone={() => setShowAdd(false)} />}

      {byCategory.length === 0 && (
        <p className="text-sm text-ink/40">
          No habits yet. Add your first one above.
        </p>
      )}

      {byCategory.length > 0 && (
        <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Habit Tracker</h2>
              <p className="text-xs text-ink/40">Week of {formatMonthDay(weekOf)}</p>
            </div>
            <span className="text-xs text-ink/40">
              {totalDone}/{totalTarget} completions this week
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-lavender transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {byCategory.map(({ category, habits: categoryHabits }) => {
        const gridHabits = categoryHabits.filter(
          (h) => h.frequency === "DAILY" || h.frequency === "WEEKLY_TARGET"
        );
        const intervalHabits = categoryHabits.filter(
          (h) => h.frequency === "INTERVAL"
        );
        const categoryDotColor = CATEGORY_COLORS[category];

        return (
          <section key={category} className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: categoryDotColor }}
              />
              {CATEGORY_LABELS[category]}
            </h2>

            {gridHabits.length > 0 && (
              <HabitGrid weekOf={weekOf} habits={gridHabits} colorMap={habitColors} />
            )}

            {intervalHabits.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {intervalHabits.map((habit) => (
                  <IntervalHabitCard
                    key={habit.id}
                    habit={habit}
                    lastDone={latestIntervalLogs[habit.id] ?? null}
                    color={habitColors[habit.id]}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
