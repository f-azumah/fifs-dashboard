"use client";

import { useRef, useTransition } from "react";
import type { Task } from "@prisma/client";
import { createTask, deleteTask, toggleTaskStatus } from "@/app/actions";
import { celebrateCompletion } from "@/lib/celebrate";

const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-amber-400",
  3: "bg-lavender/30",
};

export default function TaskList({
  weekParam,
  tasks,
}: {
  weekParam: string;
  tasks: Task[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  const doneCount = tasks.filter((t) => t.status === "DONE").length;
  const total = tasks.length;
  const progress = total > 0 ? doneCount / total : 0;

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
          This week&apos;s tasks
        </h2>
        <span className="text-xs text-ink/40">
          {doneCount}/{total} complete
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-lavender transition-all"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <ul className="flex flex-col gap-1.5">
        {tasks.map((task) => (
          <li key={task.id} className="group flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                if (task.status !== "DONE") celebrateCompletion();
                startTransition(() => toggleTaskStatus(task.id));
              }}
              className={`w-4 h-4 shrink-0 rounded border ${
                task.status === "DONE"
                  ? "bg-lavender border-lavender"
                  : "border-ink/30"
              }`}
              aria-label="Toggle done"
            />
            <span
              className={`flex-1 ${
                task.status === "DONE" ? "line-through text-ink/30" : ""
              }`}
            >
              {task.title}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS[2]}`}
            />
            <button
              onClick={() => startTransition(() => deleteTask(task.id))}
              className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-ink/60 text-xs shrink-0"
              aria-label="Delete task"
            >
              ✕
            </button>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="text-xs text-ink/30">No tasks yet.</li>
        )}
      </ul>

      <form
        ref={formRef}
        action={async (formData) => {
          await createTask(formData);
          formRef.current?.reset();
        }}
        className="flex items-center gap-1 pt-1 border-t border-ink/5"
      >
        <input type="hidden" name="weekOf" value={weekParam} />
        <input
          name="title"
          placeholder="Add a task…"
          className="flex-1 text-sm px-1.5 py-1 rounded bg-transparent placeholder:text-ink/30 focus:outline-none"
        />
        <select
          name="priority"
          defaultValue={2}
          className="text-xs bg-transparent text-ink/40 focus:outline-none"
        >
          <option value={1}>High</option>
          <option value={2}>Med</option>
          <option value={3}>Low</option>
        </select>
      </form>
    </div>
  );
}
