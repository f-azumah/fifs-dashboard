"use client";

import { useRef, useTransition } from "react";
import type { QuarterlyWin } from "@prisma/client";
import { createQuarterlyWin, deleteQuarterlyWin } from "@/app/actions";
import { celebrateCompletion } from "@/lib/celebrate";

export default function QuarterlyWins({
  quarterParam,
  wins,
}: {
  quarterParam: string;
  wins: QuarterlyWin[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
        Quarterly wins
      </h2>
      <ul className="flex flex-col gap-1.5">
        {wins.map((win) => (
          <li key={win.id} className="group flex items-start gap-2 text-sm">
            <span className="text-lavender shrink-0">✦</span>
            <span className="flex-1">{win.text}</span>
            <button
              onClick={() => startTransition(() => deleteQuarterlyWin(win.id))}
              className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-ink/60 text-xs shrink-0"
              aria-label="Delete win"
            >
              ✕
            </button>
          </li>
        ))}
        {wins.length === 0 && (
          <li className="text-xs text-ink/30">
            No wins logged yet — start celebrating your progress!
          </li>
        )}
      </ul>
      <form
        ref={formRef}
        action={async (formData) => {
          celebrateCompletion();
          await createQuarterlyWin(formData);
          formRef.current?.reset();
        }}
        className="pt-1 border-t border-ink/5"
      >
        <input type="hidden" name="quarterOf" value={quarterParam} />
        <input
          name="text"
          placeholder="Log a win…"
          className="w-full text-sm px-1.5 py-1 rounded bg-transparent placeholder:text-ink/30 focus:outline-none"
        />
      </form>
    </div>
  );
}
