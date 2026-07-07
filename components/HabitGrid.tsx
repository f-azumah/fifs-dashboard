"use client";

import { useTransition } from "react";
import type { Habit, HabitLog } from "@prisma/client";
import { DAY_LABELS, dayDate, dateOnly, formatDayNum, weekParamFor } from "@/lib/dates";
import { toggleHabitLog, deleteHabit } from "@/app/actions";

type HabitWithLogs = Habit & { logs: HabitLog[] };

export default function HabitGrid({
  weekOf,
  habits,
}: {
  weekOf: Date;
  habits: HabitWithLogs[];
}) {
  const [, startTransition] = useTransition();
  const days = DAY_LABELS.map((label, i) => ({
    label,
    date: dayDate(weekOf, i),
  }));

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10">
            <th className="text-left font-medium px-3 py-2 min-w-[160px]">
              Habit
            </th>
            {days.map((d) => (
              <th key={d.label} className="font-medium px-2 py-2 w-10 text-center">
                <div>{d.label}</div>
                <div className="text-[10px] text-black/30">
                  {formatDayNum(d.date)}
                </div>
              </th>
            ))}
            <th className="px-2 py-2 w-16 text-center font-medium">Target</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => {
            const completedDates = new Set(
              habit.logs.map((log) => dateOnly(log.date).getTime())
            );
            const completedCount = completedDates.size;
            const target =
              habit.frequency === "WEEKLY_TARGET" ? habit.weeklyTarget ?? 7 : 7;

            return (
              <tr
                key={habit.id}
                className="group border-b border-black/5 last:border-0"
              >
                <td className="px-3 py-2">
                  <span className="mr-1">{habit.icon}</span>
                  {habit.name}
                  <button
                    onClick={() => startTransition(() => deleteHabit(habit.id))}
                    className="ml-2 opacity-0 group-hover:opacity-100 text-black/30 hover:text-black/60 text-xs"
                    aria-label="Delete habit"
                  >
                    ✕
                  </button>
                </td>
                {days.map((d) => {
                  const iso = weekParamFor(d.date);
                  const done = completedDates.has(dateOnly(d.date).getTime());
                  return (
                    <td key={iso} className="text-center px-2 py-2">
                      <button
                        onClick={() =>
                          startTransition(() => toggleHabitLog(habit.id, iso))
                        }
                        className={`w-5 h-5 rounded-full border transition-colors ${
                          done
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-black/20 hover:border-black/40"
                        }`}
                        aria-label={`Toggle ${habit.name} for ${iso}`}
                      />
                    </td>
                  );
                })}
                <td className="text-center px-2 py-2 text-xs text-black/40">
                  {completedCount}/{target}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
