"use client";

import { useState, useTransition } from "react";
import type { DepthLog as DepthLogRecord, OssPrStatus } from "@prisma/client";
import { OSS_PR_STATUS_LABELS, OSS_PR_STATUS_ORDER } from "@/lib/ossPrStatus";
import { saveDepthLog } from "@/app/actions";

export default function DepthLog({
  weekParam,
  depthLog,
}: {
  weekParam: string;
  depthLog: DepthLogRecord | null;
}) {
  const [wentDeeper, setWentDeeper] = useState(depthLog?.wentDeeper ?? "");
  const [explainableNow, setExplainableNow] = useState(depthLog?.explainableNow ?? "");
  const [ossPrStatus, setOssPrStatus] = useState<OssPrStatus>(
    depthLog?.ossPrStatus ?? "NOT_STARTED"
  );
  const [, startTransition] = useTransition();

  function save(overrides: Partial<Record<string, string>> = {}) {
    const next = { wentDeeper, explainableNow, ossPrStatus, ...overrides };
    const formData = new FormData();
    formData.set("weekOf", weekParam);
    formData.set("wentDeeper", String(next.wentDeeper ?? ""));
    formData.set("explainableNow", String(next.explainableNow ?? ""));
    formData.set("ossPrStatus", String(next.ossPrStatus ?? "NOT_STARTED"));
    startTransition(() => saveDepthLog(formData));
  }

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-3 flex flex-col gap-3">
      <h2 className="text-sm font-semibold">Depth Log</h2>

      <div>
        <label className="text-xs text-ink/40">
          What did I go deeper on this week?
        </label>
        <textarea
          value={wentDeeper}
          onChange={(e) => setWentDeeper(e.target.value)}
          onBlur={() => save({ wentDeeper })}
          rows={2}
          placeholder="Doesn't have to be new work — revisiting or understanding existing code counts…"
          className="w-full text-sm bg-transparent placeholder:text-ink/30 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-ink/40">
          Specific thing I could now explain that I couldn&apos;t before
        </label>
        <textarea
          value={explainableNow}
          onChange={(e) => setExplainableNow(e.target.value)}
          onBlur={() => save({ explainableNow })}
          rows={2}
          placeholder="Be specific…"
          className="w-full text-sm bg-transparent placeholder:text-ink/30 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-ink/40">OSS PR status</label>
        <select
          value={ossPrStatus}
          onChange={(e) => {
            const next = e.target.value as OssPrStatus;
            setOssPrStatus(next);
            save({ ossPrStatus: next });
          }}
          className="w-full text-sm px-2 py-1.5 rounded border border-ink/10 bg-cream focus:outline-none"
        >
          {OSS_PR_STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {OSS_PR_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
