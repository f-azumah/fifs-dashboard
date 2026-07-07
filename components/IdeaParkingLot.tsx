"use client";

import { useRef, useTransition } from "react";
import type { Idea } from "@prisma/client";
import { createIdea, deleteIdea } from "@/app/actions";

export default function IdeaParkingLot({ ideas }: { ideas: Idea[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
        💡 Idea parking lot
      </h2>
      <p className="text-xs text-ink/30 -mt-1">Capture it now, act on it later.</p>
      <ul className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
        {ideas.map((idea) => (
          <li key={idea.id} className="group flex items-start gap-2 text-sm">
            <span className="flex-1">{idea.text}</span>
            <button
              onClick={() => startTransition(() => deleteIdea(idea.id))}
              className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-ink/60 text-xs shrink-0"
              aria-label="Delete idea"
            >
              ✕
            </button>
          </li>
        ))}
        {ideas.length === 0 && (
          <li className="text-xs text-ink/30">Your idea parking lot is empty.</li>
        )}
      </ul>
      <form
        ref={formRef}
        action={async (formData) => {
          await createIdea(formData);
          formRef.current?.reset();
        }}
        className="pt-1 border-t border-ink/5"
      >
        <input
          name="text"
          placeholder="Drop an idea…"
          className="w-full text-sm px-1.5 py-1 rounded bg-transparent placeholder:text-ink/30 focus:outline-none"
        />
      </form>
    </div>
  );
}
