export default function GymConsistencyChart({
  weeks,
}: {
  weeks: { label: string; count: number }[];
}) {
  const max = Math.max(...weeks.map((w) => w.count), 1);

  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
        🏋️ Gym consistency
      </h2>
      <p className="text-xs text-ink/30">Last {weeks.length} weeks</p>
      <div className="flex items-end gap-1 h-24 mt-1">
        {weeks.map((w, i) => (
          <div
            key={i}
            className="flex-1 h-full flex flex-col items-center justify-end"
            title={`${w.label}: ${w.count} session${w.count === 1 ? "" : "s"}`}
          >
            <div
              className={`w-full rounded-sm ${w.count > 0 ? "bg-lavender" : "bg-ink/10"}`}
              style={{ height: `${w.count > 0 ? Math.max(8, (w.count / max) * 100) : 4}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-ink/30">
        <span>{weeks.length} weeks ago</span>
        <span>This week</span>
      </div>
    </div>
  );
}
