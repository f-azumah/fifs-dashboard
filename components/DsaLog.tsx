"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import type { DsaLogEntry, Habit, HabitLog } from "@prisma/client";
import {
  DAY_LABELS,
  dayDate,
  dateOnly,
  shiftWeek,
  weekParamFor,
} from "@/lib/dates";
import { DSA_CONFIDENCE_LABELS, DSA_CONFIDENCE_ORDER } from "@/lib/dsaConfidence";
import { createDsaLogEntry, deleteDsaLogEntry, toggleHabitLog } from "@/app/actions";
import { celebrateCompletion } from "@/lib/celebrate";

type HabitWithLogs = Habit & { logs: HabitLog[] };

function EntryRow({ entry }: { entry: DsaLogEntry }) {
  const [, startTransition] = useTransition();

  return (
    <li className="group rounded-md border border-ink/10 bg-cream p-2 flex flex-col gap-1 text-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{entry.patternFocus}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-ink/30" suppressHydrationWarning>
            {new Date(entry.createdAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <button
            onClick={() => startTransition(() => deleteDsaLogEntry(entry.id))}
            className="opacity-0 group-hover:opacity-100 text-ink/30 hover:text-ink/60 text-xs"
            aria-label="Delete entry"
          >
            ✕
          </button>
        </div>
      </div>
      {(entry.problemsSolved !== null || entry.confidence) && (
        <div className="flex items-center gap-2 text-xs text-ink/50">
          {entry.problemsSolved !== null && <span>{entry.problemsSolved} solved</span>}
          {entry.confidence && (
            <span className="px-1.5 py-0.5 rounded-full bg-lavender/15 text-lavender">
              {DSA_CONFIDENCE_LABELS[entry.confidence]}
            </span>
          )}
        </div>
      )}
      {entry.stuckOn && <p className="text-xs text-ink/50">{entry.stuckOn}</p>}
    </li>
  );
}

export default function DsaLog({
  weekOf,
  neetCodeHabit,
  entries,
}: {
  weekOf: Date;
  neetCodeHabit: HabitWithLogs | null;
  entries: DsaLogEntry[];
}) {
  const [showAll, setShowAll] = useState(false);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const days = DAY_LABELS.map((label, i) => ({ label, date: dayDate(weekOf, i) }));
  const completedDates = new Set(
    (neetCodeHabit?.logs ?? []).map((log) => dateOnly(log.date).getTime())
  );
  const target = neetCodeHabit?.weeklyTarget ?? 5;

  const weekUpperBound = shiftWeek(weekOf, 1);
  const thisWeekEntries = useMemo(
    () =>
      entries.filter((e) => {
        const t = new Date(e.createdAt).getTime();
        return t >= weekOf.getTime() && t < weekUpperBound.getTime();
      }),
    [entries, weekOf, weekUpperBound]
  );

  const groupedByPattern = useMemo(() => {
    const groups = new Map<string, { label: string; items: DsaLogEntry[] }>();
    for (const entry of entries) {
      const key = entry.patternFocus.trim().toLowerCase();
      if (!groups.has(key)) groups.set(key, { label: entry.patternFocus, items: [] });
      groups.get(key)!.items.push(entry);
    }
    return Array.from(groups.values()).sort((a, b) => b.items.length - a.items.length);
  }, [entries]);

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-3 flex flex-col gap-3">
      <h2 className="text-sm font-semibold">DS&amp;A Log</h2>

      {neetCodeHabit && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink/40">{neetCodeHabit.name}</span>
            <span className="text-xs text-ink/40">
              {completedDates.size}/{target} this week
            </span>
          </div>
          <div className="flex gap-1.5">
            {days.map((d, i) => {
              const iso = weekParamFor(d.date);
              const done = completedDates.has(dateOnly(d.date).getTime());
              return (
                <button
                  key={iso}
                  onClick={() => {
                    if (!done) celebrateCompletion();
                    startTransition(() => toggleHabitLog(neetCodeHabit.id, iso));
                  }}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-md border text-[10px] transition-colors ${
                    done
                      ? "bg-lavender border-lavender text-white"
                      : "border-ink/20 hover:border-ink/40 text-ink/40"
                  }`}
                  aria-label={`Toggle ${neetCodeHabit.name} for ${DAY_LABELS[i]}`}
                >
                  {DAY_LABELS[i][0]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <form
        ref={formRef}
        action={async (formData) => {
          await createDsaLogEntry(formData);
          formRef.current?.reset();
        }}
        className="flex flex-col gap-2 pt-2 border-t border-ink/5"
      >
        <input
          name="patternFocus"
          required
          placeholder="Pattern focus (e.g. sliding window)…"
          className="w-full text-sm px-2 py-1.5 rounded border border-ink/10 bg-cream focus:outline-none"
        />
        <div className="flex gap-2">
          <input
            type="number"
            name="problemsSolved"
            min={0}
            placeholder="Problems solved"
            className="w-1/2 text-sm px-2 py-1.5 rounded border border-ink/10 bg-cream focus:outline-none"
          />
          <select
            name="confidence"
            defaultValue=""
            className="w-1/2 text-sm px-2 py-1.5 rounded border border-ink/10 bg-cream focus:outline-none"
          >
            <option value="">Confidence…</option>
            {DSA_CONFIDENCE_ORDER.map((c) => (
              <option key={c} value={c}>
                {DSA_CONFIDENCE_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <textarea
          name="stuckOn"
          rows={2}
          placeholder="Where I got stuck…"
          className="w-full text-sm px-2 py-1.5 rounded border border-ink/10 bg-cream focus:outline-none resize-none"
        />
        <button
          type="submit"
          className="text-xs px-3 py-1.5 rounded-md bg-lavender text-white hover:opacity-90 self-start"
        >
          Log session
        </button>
      </form>

      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-ink/50">
          {showAll ? "All sessions" : "This week's sessions"}
        </h3>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-xs text-lavender hover:text-ink/70"
        >
          {showAll ? "Hide past logs" : "View past logs"}
        </button>
      </div>

      {!showAll && (
        <ul className="flex flex-col gap-2">
          {thisWeekEntries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
          {thisWeekEntries.length === 0 && (
            <li className="text-xs text-ink/30">No sessions logged this week yet.</li>
          )}
        </ul>
      )}

      {showAll && (
        <div className="flex flex-col gap-3">
          {groupedByPattern.map((group) => (
            <div key={group.label.toLowerCase()}>
              <h4 className="text-xs font-semibold text-ink/60 mb-1">
                {group.label}{" "}
                <span className="text-ink/30 font-normal">({group.items.length})</span>
              </h4>
              <ul className="flex flex-col gap-2">
                {group.items.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </ul>
            </div>
          ))}
          {groupedByPattern.length === 0 && (
            <p className="text-xs text-ink/30">No sessions logged yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
