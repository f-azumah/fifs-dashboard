import { prisma } from "@/lib/prisma";
import {
  parseWeekParam,
  weekParamFor,
  shiftWeek,
  formatWeekRange,
  dayDate,
} from "@/lib/dates";
import HabitsView from "@/components/HabitsView";

export default async function HabitsPage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const weekOf = parseWeekParam(searchParams.week);
  const weekEnd = dayDate(weekOf, 6);

  const habits = await prisma.habit.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { position: "asc" }, { createdAt: "asc" }],
    include: {
      logs: {
        where: { date: { gte: weekOf, lte: weekEnd } },
      },
    },
  });

  const intervalHabitIds = habits
    .filter((h) => h.frequency === "INTERVAL")
    .map((h) => h.id);

  const latestLogs = intervalHabitIds.length
    ? await prisma.habitLog.findMany({
        where: { habitId: { in: intervalHabitIds } },
        orderBy: { date: "desc" },
      })
    : [];

  const latestByHabit: Record<string, Date> = {};
  for (const log of latestLogs) {
    if (!latestByHabit[log.habitId]) latestByHabit[log.habitId] = log.date;
  }

  return (
    <HabitsView
      weekOf={weekOf}
      weekParam={weekParamFor(weekOf)}
      weekLabel={formatWeekRange(weekOf)}
      prevWeekParam={weekParamFor(shiftWeek(weekOf, -1))}
      nextWeekParam={weekParamFor(shiftWeek(weekOf, 1))}
      habits={habits}
      latestIntervalLogs={latestByHabit}
      hasExplicitWeek={typeof searchParams.week === "string"}
    />
  );
}
