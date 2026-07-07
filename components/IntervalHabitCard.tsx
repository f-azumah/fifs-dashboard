"use client";

import { useTransition } from "react";
import type { Habit } from "@prisma/client";
import { daysBetween, todayUTCDateOnly, formatMonthDay } from "@/lib/dates";
import { logHabitCompletionToday, deleteHabit } from "@/app/actions";
import { celebrateCompletion } from "@/lib/celebrate";

export default function IntervalHabitCard({
  habit,
  lastDone,
}: {
  habit: Habit;
  lastDone: Date | null;
}) {
  const [isPending, startTransition] = useTransition();
  const intervalDays = habit.intervalDays ?? 30;
  const today = todayUTCDateOnly();

  const elapsed = lastDone ? daysBetween(lastDone, today) : null;
  const nextDue = lastDone
    ? new Date(lastDone.getTime() + intervalDays * 86400000)
    : null;
  const daysUntilDue = nextDue ? daysBetween(today, nextDue) : null;
  const progress = elapsed !== null ? Math.min(1, elapsed / intervalDays) : 0;
  const overdue = daysUntilDue !== null && daysUntilDue < 0;

  return (
    <div className="group rounded-lg border border-ink/10 bg-cream/60 p-3 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium">
            <span className="mr-1">{habit.icon}</span>
            {habit.name}
          </h3>
          <p className="text-xs text-ink/40">
            every {intervalDays} days
          </p>
        </div>
        <button
          onClick={() => startTransition(() => deleteHabit(habit.id))}
          className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-ink/60 text-xs"
          aria-label="Delete habit"
        >
          ✕
        </button>
      </div>

      <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${overdue ? "bg-red-400" : "bg-lavender"}`}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <p className="text-xs text-ink/50">
        {lastDone
          ? `Last done ${formatMonthDay(lastDone)} (${elapsed}d ago)`
          : "Not logged yet"}
        {nextDue &&
          (overdue
            ? ` · overdue by ${Math.abs(daysUntilDue!)}d`
            : ` · due in ${daysUntilDue}d`)}
      </p>

      <button
        disabled={isPending}
        onClick={() => {
          celebrateCompletion();
          startTransition(() => logHabitCompletionToday(habit.id));
        }}
        className="text-xs px-2 py-1.5 rounded-md bg-ink/90 text-white hover:bg-ink self-start"
      >
        Mark done today
      </button>
    </div>
  );
}
