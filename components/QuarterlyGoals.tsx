"use client";

import { useRef, useTransition } from "react";
import type { GoalCategory, QuarterlyGoal } from "@prisma/client";
import {
  createQuarterlyGoal,
  deleteQuarterlyGoal,
  toggleQuarterlyGoal,
} from "@/app/actions";
import { celebrateCompletion } from "@/lib/celebrate";
import { HABIT_COLOR_PALETTE } from "@/lib/habitMeta";

const CATEGORY_ORDER: GoalCategory[] = [
  "FINANCE",
  "HEALTH",
  "BUSINESS",
  "PERSONAL",
  "ENGINEERING_CREDIBILITY",
];
const CATEGORY_LABELS: Record<GoalCategory, string> = {
  FINANCE: "Finance",
  HEALTH: "Health",
  BUSINESS: "Business",
  PERSONAL: "Personal",
  ENGINEERING_CREDIBILITY: "Engineering Credibility",
};
const CATEGORY_COLORS: Record<GoalCategory, string> = {
  FINANCE: HABIT_COLOR_PALETTE[0],
  HEALTH: HABIT_COLOR_PALETTE[1],
  BUSINESS: HABIT_COLOR_PALETTE[2],
  PERSONAL: HABIT_COLOR_PALETTE[3],
  ENGINEERING_CREDIBILITY: HABIT_COLOR_PALETTE[4],
};

function CategoryGoalCard({
  category,
  quarterParam,
  goals,
}: {
  category: GoalCategory;
  quarterParam: string;
  goals: QuarterlyGoal[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();
  const color = CATEGORY_COLORS[category];

  return (
    <div
      className="rounded-md border p-3 flex flex-col gap-2"
      style={{ backgroundColor: `${color}2E`, borderColor: `${color}55` }}
    >
      <h3 className="text-xs font-semibold text-ink/60">{CATEGORY_LABELS[category]}</h3>
      <ul className="flex flex-col gap-1.5">
        {goals.map((goal) => (
          <li key={goal.id} className="group flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                if (!goal.done) celebrateCompletion();
                startTransition(() => toggleQuarterlyGoal(goal.id));
              }}
              style={{
                backgroundColor: goal.done ? color : undefined,
                borderColor: color,
              }}
              className="w-4 h-4 shrink-0 rounded border"
              aria-label="Toggle goal done"
            />
            <span className={`flex-1 ${goal.done ? "line-through text-ink/30" : ""}`}>
              {goal.title}
            </span>
            <button
              onClick={() => startTransition(() => deleteQuarterlyGoal(goal.id))}
              className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-ink/60 text-xs shrink-0"
              aria-label="Delete goal"
            >
              ✕
            </button>
          </li>
        ))}
        {goals.length === 0 && <li className="text-xs text-ink/30">No goals yet.</li>}
      </ul>
      <form
        ref={formRef}
        action={async (formData) => {
          await createQuarterlyGoal(formData);
          formRef.current?.reset();
        }}
        className="pt-1 border-t"
        style={{ borderColor: `${color}33` }}
      >
        <input type="hidden" name="quarterOf" value={quarterParam} />
        <input type="hidden" name="category" value={category} />
        <input
          name="title"
          placeholder={`Add ${CATEGORY_LABELS[category]} goal…`}
          className="w-full text-sm px-1.5 py-1 rounded bg-transparent placeholder:text-ink/30 focus:outline-none"
        />
      </form>
    </div>
  );
}

export default function QuarterlyGoals({
  quarterParam,
  goals,
}: {
  quarterParam: string;
  goals: QuarterlyGoal[];
}) {
  const total = goals.length;
  const done = goals.filter((g) => g.done).length;

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
          Quarterly goals
        </h2>
        <span className="text-xs text-ink/40">
          {done}/{total} complete
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORY_ORDER.map((category) => (
          <CategoryGoalCard
            key={category}
            category={category}
            quarterParam={quarterParam}
            goals={goals.filter((g) => g.category === category)}
          />
        ))}
      </div>
    </div>
  );
}
