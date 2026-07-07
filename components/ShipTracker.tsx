"use client";

import { useState, useTransition } from "react";
import type { FailureMode, WeeklyReflection } from "@prisma/client";
import { FAILURE_MODE_LABELS, FAILURE_MODE_ORDER } from "@/lib/failureModes";
import { saveShipReport } from "@/app/actions";

export default function ShipTracker({
  weekParam,
  reflection,
}: {
  weekParam: string;
  reflection: WeeklyReflection | null;
}) {
  const [didShip, setDidShip] = useState(reflection?.didShip ?? false);
  const [hoursSpent, setHoursSpent] = useState(
    reflection?.hoursSpent?.toString() ?? ""
  );
  const [shipped, setShipped] = useState(reflection?.shipped ?? "");
  const [notShipped, setNotShipped] = useState(reflection?.notShipped ?? "");
  const [failureMode, setFailureMode] = useState<FailureMode | "">(
    reflection?.failureMode ?? ""
  );
  const [, startTransition] = useTransition();

  function save(overrides: Partial<Record<string, string | boolean>> = {}) {
    const next = {
      didShip,
      hoursSpent,
      shipped,
      notShipped,
      failureMode,
      ...overrides,
    };
    const formData = new FormData();
    formData.set("weekOf", weekParam);
    formData.set("didShip", String(next.didShip));
    formData.set("hoursSpent", String(next.hoursSpent ?? ""));
    formData.set("shipped", String(next.shipped ?? ""));
    formData.set("notShipped", String(next.notShipped ?? ""));
    formData.set("failureMode", String(next.failureMode ?? ""));
    startTransition(() => saveShipReport(formData));
  }

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Ship report</h2>
        <button
          onClick={() => {
            const next = !didShip;
            setDidShip(next);
            save({ didShip: next });
          }}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            didShip
              ? "bg-lavender text-white"
              : "bg-ink/5 text-ink/50 hover:bg-ink/10"
          }`}
        >
          {didShip ? "Shipped ✓" : "Didn't ship"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-ink/40 shrink-0">Hours spent</label>
        <input
          type="number"
          min={0}
          step={0.5}
          value={hoursSpent}
          onChange={(e) => setHoursSpent(e.target.value)}
          onBlur={() => save({ hoursSpent })}
          className="w-20 text-sm px-2 py-1 rounded border border-ink/10 bg-cream focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs text-ink/40">What shipped</label>
        <textarea
          value={shipped}
          onChange={(e) => setShipped(e.target.value)}
          onBlur={() => save({ shipped })}
          rows={2}
          placeholder="What actually went out the door…"
          className="w-full text-sm bg-transparent placeholder:text-ink/30 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-ink/40">What didn&apos;t</label>
        <textarea
          value={notShipped}
          onChange={(e) => setNotShipped(e.target.value)}
          onBlur={() => save({ notShipped })}
          rows={2}
          placeholder="What slipped…"
          className="w-full text-sm bg-transparent placeholder:text-ink/30 focus:outline-none resize-none"
        />
      </div>

      {!didShip && (
        <div>
          <label className="text-xs text-ink/40">Failure mode</label>
          <select
            value={failureMode}
            onChange={(e) => {
              const next = e.target.value as FailureMode | "";
              setFailureMode(next);
              save({ failureMode: next });
            }}
            className="w-full text-sm px-2 py-1.5 rounded border border-ink/10 bg-cream focus:outline-none"
          >
            <option value="">Select one…</option>
            {FAILURE_MODE_ORDER.map((mode) => (
              <option key={mode} value={mode}>
                {FAILURE_MODE_LABELS[mode]}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
