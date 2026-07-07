import ical from "node-ical";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
};

function feedUrls(): string[] {
  const raw = process.env.APPLE_CALENDAR_ICS_URLS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^webcal:\/\//i, "https://"));
}

function textValue(value: string | { val: string } | undefined, fallback: string): string {
  if (!value) return fallback;
  return typeof value === "string" ? value : value.val;
}

export async function getCalendarEventsForRange(
  rangeStart: Date,
  rangeEnd: Date
): Promise<CalendarEvent[]> {
  const urls = feedUrls();
  if (urls.length === 0) return [];

  const results: CalendarEvent[] = [];

  await Promise.all(
    urls.map(async (url) => {
      try {
        const data = await ical.async.fromURL(url);
        for (const key in data) {
          const event = data[key];
          if (!event || event.type !== "VEVENT") continue;

          const instances = ical.expandRecurringEvent(event, {
            from: rangeStart,
            to: rangeEnd,
          });

          for (const instance of instances) {
            results.push({
              id: `${event.uid}-${instance.start.toISOString()}`,
              title: textValue(instance.summary, "Untitled event"),
              start: instance.start,
              end: instance.end,
              allDay: instance.isFullDay,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch calendar feed", url, err);
      }
    })
  );

  return results.sort((a, b) => a.start.getTime() - b.start.getTime());
}
