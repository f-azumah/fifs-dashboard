import { prisma } from "@/lib/prisma";
import {
  parseQuarterParam,
  quarterParamFor,
  shiftQuarter,
  quarterLabel,
  quarterEnd,
  mondayOf,
  shiftWeek,
  weekParamFor,
  todayUTCDateOnly,
} from "@/lib/dates";
import QuarterView from "@/components/QuarterView";

export default async function QuarterPage({
  searchParams,
}: {
  searchParams: { quarter?: string };
}) {
  const qStart = parseQuarterParam(searchParams.quarter);
  const qEnd = quarterEnd(qStart);

  const thisWeekStart = mondayOf(todayUTCDateOnly());
  const weekStarts = Array.from({ length: 13 }, (_, i) => shiftWeek(thisWeekStart, i - 12));
  const earliestWeek = weekStarts[0];
  const upperBound = shiftWeek(thisWeekStart, 1);

  const [goals, wins, ideas, books, gymSessions, codingHabits] = await Promise.all([
    prisma.quarterlyGoal.findMany({
      where: { quarterOf: qStart },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    }),
    prisma.quarterlyWin.findMany({
      where: { quarterOf: qStart },
      orderBy: { createdAt: "desc" },
    }),
    prisma.idea.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.bookLog.findMany({
      where: { completedAt: { gte: qStart, lte: qEnd } },
      orderBy: { completedAt: "desc" },
    }),
    prisma.gymSession.findMany({
      where: { date: { gte: earliestWeek, lt: upperBound } },
    }),
    prisma.habit.findMany({
      where: {
        name: { in: ["NeetCode 150 — problem opened", "DS&A practice (TypeScript)"] },
      },
      include: {
        logs: { where: { date: { gte: earliestWeek, lt: upperBound } } },
      },
    }),
  ]);

  const gymWeeks = weekStarts.map((ws) => {
    const we = shiftWeek(ws, 1);
    const count = gymSessions.filter((s) => s.date >= ws && s.date < we).length;
    return { label: weekParamFor(ws), count };
  });

  const codingLogs = codingHabits.flatMap((h) => h.logs);
  const codingWeeks = weekStarts.map((ws) => {
    const we = shiftWeek(ws, 1);
    const daysWithActivity = new Set(
      codingLogs
        .filter((l) => l.date >= ws && l.date < we)
        .map((l) => l.date.getTime())
    );
    return { label: weekParamFor(ws), count: daysWithActivity.size };
  });

  return (
    <QuarterView
      quarterParam={quarterParamFor(qStart)}
      quarterLabel={quarterLabel(qStart)}
      prevQuarterParam={quarterParamFor(shiftQuarter(qStart, -1))}
      nextQuarterParam={quarterParamFor(shiftQuarter(qStart, 1))}
      goals={goals}
      wins={wins}
      ideas={ideas}
      books={books}
      gymWeeks={gymWeeks}
      codingWeeks={codingWeeks}
    />
  );
}
