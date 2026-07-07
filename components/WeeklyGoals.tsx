"use client";

import { useRef, useTransition } from "react";
import type { WeeklyGoal } from "@prisma/client";
import { createWeeklyGoal, deleteWeeklyGoal, toggleWeeklyGoal } from "@/app/actions";
import { celebrateCompletion } from "@/lib/celebrate";

export default function WeeklyGoals({
  weekParam,
  goals,
}: {
  weekParam: string;
  goals: WeeklyGoal[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
        Goals
      </h3>

      <ul className="flex flex-col gap-1.5">
        {goals.map((goal) => (
          <li key={goal.id} className="group flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                if (!goal.done) celebrateCompletion();
                startTransition(() => toggleWeeklyGoal(goal.id));
              }}
              className={`w-4 h-4 shrink-0 rounded border ${
                goal.done ? "bg-lavender border-lavender" : "border-ink/30"
              }`}
              aria-label="Toggle goal done"
            />
            <span className={`flex-1 ${goal.done ? "line-through text-ink/30" : ""}`}>
              {goal.title}
            </span>
            <button
              onClick={() => startTransition(() => deleteWeeklyGoal(goal.id))}
              className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-ink/60 text-xs shrink-0"
              aria-label="Delete goal"
            >
              ✕
            </button>
          </li>
        ))}
        {goals.length === 0 && (
          <li className="text-xs text-ink/30">No goals set yet.</li>
        )}
      </ul>

      <form
        ref={formRef}
        action={async (formData) => {
          await createWeeklyGoal(formData);
          formRef.current?.reset();
        }}
        className="pt-1 border-t border-ink/5"
      >
        <input type="hidden" name="weekOf" value={weekParam} />
        <input
          name="title"
          placeholder="Add a goal…"
          className="w-full text-sm px-1.5 py-1 rounded bg-transparent placeholder:text-ink/30 focus:outline-none"
        />
      </form>
    </div>
  );
}
