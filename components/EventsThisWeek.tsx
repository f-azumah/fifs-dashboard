"use client";

import type { CalendarEvent } from "@/lib/calendar";

export default function EventsThisWeek({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-cream/60 p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
        Events this week
      </h2>
      <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {events.map((event) => {
          const start = new Date(event.start);
          return (
            <li key={event.id} className="flex items-center gap-3 text-sm">
              <div
                className="flex flex-col items-center justify-center rounded-md border border-lavender/30 bg-lavender/10 w-10 h-10 shrink-0"
                suppressHydrationWarning
              >
                <span className="text-[9px] uppercase leading-none text-lavender">
                  {start.toLocaleDateString(undefined, { month: "short" })}
                </span>
                <span className="text-sm font-semibold leading-tight text-ink/70">
                  {start.getDate()}
                </span>
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-ink/80">{event.title}</span>
                <span className="text-xs text-ink/40" suppressHydrationWarning>
                  {event.allDay
                    ? "All day"
                    : start.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                </span>
              </div>
            </li>
          );
        })}
        {events.length === 0 && (
          <li className="text-xs text-ink/30">No events synced this week.</li>
        )}
      </ul>
    </div>
  );
}
