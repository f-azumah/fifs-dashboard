import { prisma } from "@/lib/prisma";
import {
  parseWeekParam,
  weekParamFor,
  shiftWeek,
  formatWeekRange,
  dayDate,
  parseDayParam,
  shiftDay,
  todayUTCDateOnly,
} from "@/lib/dates";
import { getCalendarEventsForRange } from "@/lib/calendar";
import WeekView from "@/components/WeekView";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { week?: string; day?: string };
}) {
  const weekOf = parseWeekParam(searchParams.week);
  const weekEnd = dayDate(weekOf, 6);
  const day = parseDayParam(searchParams.day);

  const [
    tasks,
    reflection,
    weeklyGoals,
    gymSessions,
    gymSettings,
    dailyCheckIn,
    reflectionCount,
    currentlyReading,
    events,
    depthLog,
  ] = await Promise.all([
    prisma.task.findMany({
      where: { weekOf },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    }),
    prisma.weeklyReflection.findUnique({ where: { weekOf } }),
    prisma.weeklyGoal.findMany({
      where: { weekOf },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    }),
    prisma.gymSession.findMany({
      where: { date: { gte: weekOf, lte: weekEnd } },
    }),
    prisma.gymSettings.findUnique({ where: { id: "singleton" } }),
    prisma.dailyCheckIn.findUnique({ where: { date: day } }),
    prisma.dailyCheckIn.count({
      where: { AND: [{ note: { not: null } }, { note: { not: "" } }] },
    }),
    prisma.currentlyReading.findUnique({ where: { id: "singleton" } }),
    getCalendarEventsForRange(weekOf, shiftWeek(weekOf, 1)),
    prisma.depthLog.findUnique({ where: { weekOf } }),
  ]);

  const dayParam = weekParamFor(day);
  const todayParam = weekParamFor(todayUTCDateOnly());

  return (
    <WeekView
      weekOf={weekOf}
      weekParam={weekParamFor(weekOf)}
      weekLabel={formatWeekRange(weekOf)}
      prevWeekParam={weekParamFor(shiftWeek(weekOf, -1))}
      nextWeekParam={weekParamFor(shiftWeek(weekOf, 1))}
      tasks={tasks}
      reflection={reflection}
      weeklyGoals={weeklyGoals}
      gymSessionDates={gymSessions.map((s) => s.date)}
      gymWeeklyTarget={gymSettings?.weeklyTarget ?? 5}
      dayParam={dayParam}
      dayLabel={day}
      prevDayParam={weekParamFor(shiftDay(day, -1))}
      nextDayParam={weekParamFor(shiftDay(day, 1))}
      todayParam={todayParam}
      isToday={dayParam === todayParam}
      dailyNote={dailyCheckIn?.note ?? ""}
      reflectionCount={reflectionCount}
      currentlyReading={currentlyReading}
      events={events}
      depthLog={depthLog}
    />
  );
}
