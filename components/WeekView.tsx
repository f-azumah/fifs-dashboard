"use client";

import Link from "next/link";
import type { Task, WeeklyReflection } from "@prisma/client";
import { DAY_LABELS, dayDate, formatMonthDay } from "@/lib/dates";
import TaskColumn from "@/components/TaskColumn";
import WeeklyFocus from "@/components/WeeklyFocus";

type Props = {
  weekOf: Date;
  weekParam: string;
  weekLabel: string;
  prevWeekParam: string;
  nextWeekParam: string;
  tasks: Task[];
  reflection: WeeklyReflection | null;
};

export default function WeekView({
  weekOf,
  weekParam,
  weekLabel,
  prevWeekParam,
  nextWeekParam,
  tasks,
  reflection,
}: Props) {
  const scheduled = DAY_LABELS.map((label, dayOfWeek) => ({
    dayOfWeek,
    label,
    date: dayDate(weekOf, dayOfWeek),
    tasks: tasks.filter((t) => t.dayOfWeek === dayOfWeek),
  }));

  const unscheduled = tasks.filter((t) => t.dayOfWeek === null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/?week=${prevWeekParam}`}
            className="px-2 py-1 rounded-md text-sm hover:bg-black/5"
          >
            ← Prev
          </Link>
          <h1 className="text-lg font-semibold min-w-[220px] text-center">
            {weekLabel}
          </h1>
          <Link
            href={`/?week=${nextWeekParam}`}
            className="px-2 py-1 rounded-md text-sm hover:bg-black/5"
          >
            Next →
          </Link>
        </div>
        <Link
          href="/"
          className="text-sm text-black/50 hover:text-black/80"
        >
          Today
        </Link>
      </div>

      <WeeklyFocus weekParam={weekParam} reflection={reflection} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scheduled.map((day) => (
          <TaskColumn
            key={day.dayOfWeek}
            title={day.label}
            subtitle={formatMonthDay(day.date)}
            dayOfWeek={day.dayOfWeek}
            weekParam={weekParam}
            tasks={day.tasks}
          />
        ))}
        <TaskColumn
          title="This week"
          subtitle="unscheduled"
          dayOfWeek={null}
          weekParam={weekParam}
          tasks={unscheduled}
        />
      </div>
    </div>
  );
}
