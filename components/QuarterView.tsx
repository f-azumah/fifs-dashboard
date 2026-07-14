"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BookLog, Idea, QuarterlyGoal, QuarterlyWin } from "@prisma/client";
import { localQuarterParamNow } from "@/lib/dates";
import ConsistencyChart from "@/components/ConsistencyChart";
import QuarterlyGoals from "@/components/QuarterlyGoals";
import QuarterlyWins from "@/components/QuarterlyWins";
import IdeaParkingLot from "@/components/IdeaParkingLot";
import BooksRead from "@/components/BooksRead";

export default function QuarterView({
  quarterParam,
  quarterLabel,
  prevQuarterParam,
  nextQuarterParam,
  goals,
  wins,
  ideas,
  books,
  gymWeeks,
  codingWeeks,
  hasExplicitQuarter,
}: {
  quarterParam: string;
  quarterLabel: string;
  prevQuarterParam: string;
  nextQuarterParam: string;
  goals: QuarterlyGoal[];
  wins: QuarterlyWin[];
  ideas: Idea[];
  books: BookLog[];
  gymWeeks: { label: string; count: number }[];
  codingWeeks: { label: string; count: number }[];
  hasExplicitQuarter: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (hasExplicitQuarter) return;
    const localQuarter = localQuarterParamNow();
    if (localQuarter !== quarterParam) {
      router.replace(`/quarter?quarter=${localQuarter}`);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/quarter?quarter=${prevQuarterParam}`}
            className="px-2 py-1 rounded-md text-sm hover:bg-ink/5"
          >
            ← Prev
          </Link>
          <h1 className="text-lg font-semibold min-w-[160px] text-center">
            {quarterLabel}
          </h1>
          <Link
            href={`/quarter?quarter=${nextQuarterParam}`}
            className="px-2 py-1 rounded-md text-sm hover:bg-ink/5"
          >
            Next →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <ConsistencyChart weeks={gymWeeks} title="🏋️ Gym consistency" />
          <ConsistencyChart weeks={codingWeeks} title="💻 Coding consistency" />
          <QuarterlyGoals quarterParam={quarterParam} goals={goals} />
        </div>
        <div className="flex flex-col gap-4">
          <BooksRead books={books} />
          <QuarterlyWins quarterParam={quarterParam} wins={wins} />
          <IdeaParkingLot ideas={ideas} />
        </div>
      </div>
    </div>
  );
}
