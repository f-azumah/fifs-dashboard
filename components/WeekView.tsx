"use client";

import Link from "next/link";
import type {
  CurrentlyReading as CurrentlyReadingRecord,
  DepthLog as DepthLogRecord,
  Task,
  WeeklyGoal,
  WeeklyReflection,
} from "@prisma/client";
import type { CalendarEvent } from "@/lib/calendar";
import FocusGoalsCard from "@/components/FocusGoalsCard";
import TaskList from "@/components/TaskList";
import EventsThisWeek from "@/components/EventsThisWeek";
import GymTracker from "@/components/GymTracker";
import CurrentlyReading from "@/components/CurrentlyReading";
import ReflectionWidget from "@/components/ReflectionWidget";
import ShipTracker from "@/components/ShipTracker";
import DepthLog from "@/components/DepthLog";

type Props = {
  weekOf: Date;
  weekParam: string;
  weekLabel: string;
  prevWeekParam: string;
  nextWeekParam: string;
  tasks: Task[];
  reflection: WeeklyReflection | null;
  weeklyGoals: WeeklyGoal[];
  gymSessionDates: Date[];
  gymWeeklyTarget: number;
  dayParam: string;
  dayLabel: Date;
  prevDayParam: string;
  nextDayParam: string;
  todayParam: string;
  isToday: boolean;
  dailyNote: string;
  reflectionCount: number;
  currentlyReading: CurrentlyReadingRecord | null;
  events: CalendarEvent[];
  depthLog: DepthLogRecord | null;
};

export default function WeekView({
  weekOf,
  weekParam,
  weekLabel,
  prevWeekParam,
  nextWeekParam,
  tasks,
  reflection,
  weeklyGoals,
  gymSessionDates,
  gymWeeklyTarget,
  dayParam,
  dayLabel,
  prevDayParam,
  nextDayParam,
  todayParam,
  isToday,
  dailyNote,
  reflectionCount,
  currentlyReading,
  events,
  depthLog,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/?week=${prevWeekParam}&day=${dayParam}`}
            className="px-2 py-1 rounded-md text-sm hover:bg-ink/5"
          >
            ← Prev
          </Link>
          <h1 className="text-lg font-semibold min-w-[220px] text-center">
            {weekLabel}
          </h1>
          <Link
            href={`/?week=${nextWeekParam}&day=${dayParam}`}
            className="px-2 py-1 rounded-md text-sm hover:bg-ink/5"
          >
            Next →
          </Link>
        </div>
        <Link href="/" className="text-sm text-ink/50 hover:text-ink/80">
          Today
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <FocusGoalsCard
            key={`focus-${weekParam}`}
            weekOf={weekOf}
            weekParam={weekParam}
            reflection={reflection}
            goals={weeklyGoals}
          />
          <TaskList weekParam={weekParam} tasks={tasks} />
          <EventsThisWeek events={events} />
          <ReflectionWidget
            key={dayParam}
            weekParam={weekParam}
            dayParam={dayParam}
            dayLabel={dayLabel}
            prevDayParam={prevDayParam}
            nextDayParam={nextDayParam}
            todayParam={todayParam}
            isToday={isToday}
            note={dailyNote}
            reflectionCount={reflectionCount}
          />
        </div>
        <div className="flex flex-col gap-4">
          <GymTracker
            weekOf={weekOf}
            sessionDates={gymSessionDates}
            weeklyTarget={gymWeeklyTarget}
          />
          <ShipTracker key={`ship-${weekParam}`} weekParam={weekParam} reflection={reflection} />
          <DepthLog key={`depth-${weekParam}`} weekParam={weekParam} depthLog={depthLog} />
          <CurrentlyReading reading={currentlyReading} />
        </div>
      </div>
    </div>
  );
}
