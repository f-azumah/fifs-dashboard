import { prisma } from "@/lib/prisma";
import { parseWeekParam, weekParamFor, shiftWeek, formatWeekRange } from "@/lib/dates";
import WeekView from "@/components/WeekView";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const weekOf = parseWeekParam(searchParams.week);

  const [tasks, reflection] = await Promise.all([
    prisma.task.findMany({
      where: { weekOf },
      orderBy: [{ dayOfWeek: "asc" }, { position: "asc" }, { createdAt: "asc" }],
    }),
    prisma.weeklyReflection.findUnique({ where: { weekOf } }),
  ]);

  return (
    <WeekView
      weekOf={weekOf}
      weekParam={weekParamFor(weekOf)}
      weekLabel={formatWeekRange(weekOf)}
      prevWeekParam={weekParamFor(shiftWeek(weekOf, -1))}
      nextWeekParam={weekParamFor(shiftWeek(weekOf, 1))}
      tasks={tasks}
      reflection={reflection}
    />
  );
}
