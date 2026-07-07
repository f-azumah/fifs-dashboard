"use client";

import { useRef, useTransition } from "react";
import type { Task } from "@prisma/client";
import { createTask, deleteTask, toggleTaskStatus } from "@/app/actions";

const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-amber-400",
  3: "bg-slate-300",
};

export default function TaskColumn({
  title,
  subtitle,
  dayOfWeek,
  weekParam,
  tasks,
}: {
  title: string;
  subtitle: string;
  dayOfWeek: number | null;
  weekParam: string;
  tasks: Task[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-black/10 bg-white/60 p-3 flex flex-col gap-2 min-h-[160px]">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-black/40">{subtitle}</p>
      </div>

      <ul className="flex flex-col gap-1.5 flex-1">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-start gap-2 text-sm"
          >
            <button
              onClick={() => startTransition(() => toggleTaskStatus(task.id))}
              className={`mt-0.5 w-4 h-4 shrink-0 rounded border ${
                task.status === "DONE"
                  ? "bg-black/80 border-black/80"
                  : "border-black/30"
              }`}
              aria-label="Toggle done"
            />
            <span
              className={`flex-1 ${
                task.status === "DONE" ? "line-through text-black/30" : ""
              }`}
            >
              {task.title}
            </span>
            <span
              className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS[2]}`}
            />
            <button
              onClick={() => startTransition(() => deleteTask(task.id))}
              className="opacity-0 group-hover:opacity-100 text-black/30 hover:text-black/60 text-xs shrink-0"
              aria-label="Delete task"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <form
        ref={formRef}
        action={async (formData) => {
          await createTask(formData);
          formRef.current?.reset();
        }}
        className="flex items-center gap-1 pt-1 border-t border-black/5"
      >
        <input type="hidden" name="weekOf" value={weekParam} />
        {dayOfWeek !== null && (
          <input type="hidden" name="dayOfWeek" value={dayOfWeek} />
        )}
        <input
          name="title"
          placeholder="Add task…"
          className="flex-1 text-sm px-1.5 py-1 rounded bg-transparent placeholder:text-black/30 focus:outline-none"
        />
        <select
          name="priority"
          defaultValue={2}
          className="text-xs bg-transparent text-black/40 focus:outline-none"
        >
          <option value={1}>High</option>
          <option value={2}>Med</option>
          <option value={3}>Low</option>
        </select>
      </form>
    </div>
  );
}
