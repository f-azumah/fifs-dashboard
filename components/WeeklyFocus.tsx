"use client";

import { useState, useTransition } from "react";
import type { WeeklyReflection } from "@prisma/client";
import { saveWeeklyReflection } from "@/app/actions";

export default function WeeklyFocus({
  weekParam,
  reflection,
}: {
  weekParam: string;
  reflection: WeeklyReflection | null;
}) {
  const [focus, setFocus] = useState(reflection?.focus ?? "");
  const [note, setNote] = useState(reflection?.reflection ?? "");
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function save(next: { focus?: string; reflection?: string }) {
    const formData = new FormData();
    formData.set("weekOf", weekParam);
    formData.set("focus", next.focus ?? focus);
    formData.set("reflection", next.reflection ?? note);
    startTransition(async () => {
      await saveWeeklyReflection(formData);
      setSavedAt(Date.now());
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-lg border border-black/10 bg-white/60 p-3">
        <h2 className="text-sm font-semibold mb-1.5">This week&apos;s focus</h2>
        <textarea
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          onBlur={() => save({ focus })}
          placeholder="What matters most this week?"
          rows={3}
          className="w-full text-sm bg-transparent placeholder:text-black/30 focus:outline-none resize-none"
        />
      </div>
      <div className="rounded-lg border border-black/10 bg-white/60 p-3">
        <h2 className="text-sm font-semibold mb-1.5">End-of-week reflection</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => save({ reflection: note })}
          placeholder="How did it go?"
          rows={3}
          className="w-full text-sm bg-transparent placeholder:text-black/30 focus:outline-none resize-none"
        />
      </div>
      <p className="col-span-full text-xs text-black/30 -mt-2">
        {isPending ? "Saving…" : savedAt ? "Saved" : " "}
      </p>
    </div>
  );
}
