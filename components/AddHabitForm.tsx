"use client";

import { useRef, useState } from "react";
import { createHabit } from "@/app/actions";
import { CATEGORY_ORDER, CATEGORY_LABELS } from "@/lib/habitMeta";

export default function AddHabitForm({ onDone }: { onDone: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY_TARGET" | "INTERVAL">(
    "DAILY"
  );

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabit(formData);
        formRef.current?.reset();
        setFrequency("DAILY");
        onDone();
      }}
      className="rounded-lg border border-black/10 bg-white/60 p-3 flex flex-wrap items-end gap-3"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/40">Name</label>
        <input
          name="name"
          required
          placeholder="e.g. Protein treatment"
          className="text-sm px-2 py-1.5 rounded border border-black/10 bg-white focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/40">Icon</label>
        <input
          name="icon"
          placeholder="💧"
          maxLength={2}
          className="text-sm px-2 py-1.5 rounded border border-black/10 bg-white w-14 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/40">Category</label>
        <select
          name="category"
          className="text-sm px-2 py-1.5 rounded border border-black/10 bg-white focus:outline-none"
        >
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-black/40">Frequency</label>
        <select
          name="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as typeof frequency)}
          className="text-sm px-2 py-1.5 rounded border border-black/10 bg-white focus:outline-none"
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY_TARGET">X times per week</option>
          <option value="INTERVAL">Every N days</option>
        </select>
      </div>

      {frequency === "WEEKLY_TARGET" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/40">Times / week</label>
          <input
            type="number"
            name="weeklyTarget"
            min={1}
            max={7}
            defaultValue={5}
            className="text-sm px-2 py-1.5 rounded border border-black/10 bg-white w-16 focus:outline-none"
          />
        </div>
      )}

      {frequency === "INTERVAL" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/40">Every (days)</label>
          <input
            type="number"
            name="intervalDays"
            min={1}
            defaultValue={49}
            className="text-sm px-2 py-1.5 rounded border border-black/10 bg-white w-20 focus:outline-none"
          />
        </div>
      )}

      <button
        type="submit"
        className="text-sm px-3 py-1.5 rounded-md bg-black/90 text-white hover:bg-black"
      >
        Add
      </button>
    </form>
  );
}
