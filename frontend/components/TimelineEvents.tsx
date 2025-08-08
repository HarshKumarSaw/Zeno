// /components/TimelineEvents.tsx
import React from "react";
import { TimelineEvent } from "../types/event";
import { getDurationInMinutes, getHourFractionFromISO } from "../utils/time";

const COLOR_MAP: Record<string, string> = {
  "1": "#EF4444",
  "2": "#F59E42",
  "3": "#38BDF8",
  "4": "#22C55E",
};
const DEFAULT_COLOR = "#6366F1";

type TimelineEventProps = {
  event: TimelineEvent;
};

export default function TimelineEventComponent({ event }: TimelineEventProps) {
  // Timezone for display and grid placement, always Asia/Kolkata for your use-case
  const TIMEZONE = "Asia/Kolkata";

  // Use new utils for hour and duration
  const startHour = getHourFractionFromISO(event.start, TIMEZONE);
  const durationMin = getDurationInMinutes(event.start, event.end);
  const top = startHour * 96;
  const height = (durationMin / 60) * 96;

  // Color
  const bgColor =
    (event.colorId && COLOR_MAP[event.colorId]) || DEFAULT_COLOR;

  // Display strings (for user, show them in IST too)
  // You can customize this as needed
  // For robust formatting use dayjs for display as well
  import dayjs from 'dayjs'; // Add at top
  import timezone from 'dayjs-plugin-timezone'; // Add at top if not present
  dayjs.extend(timezone);

  const displayStart = dayjs(event.start)
    .tz(TIMEZONE)
    .format("HH:mm");
  const displayEnd = dayjs(event.end)
    .tz(TIMEZONE)
    .format("HH:mm");

  return (
    <article
      className="absolute left-16 right-4 rounded-lg p-2 bg-opacity-90 text-white shadow-md overflow-hidden flex flex-col gap-1 justify-center transition-all duration-200"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: bgColor,
        zIndex: 10,
      }}
      aria-label={`${event.title}, from ${displayStart} to ${displayEnd}`}
      title={`${event.title} (${displayStart} – ${displayEnd})`}
    >
      <header className="font-semibold text-sm leading-tight truncate">
        {event.title}
      </header>
      {!event.allDay && (
        <time className="text-xs text-white/85 leading-tight">
          {displayStart} – {displayEnd}
        </time>
      )}
      {event.location && (
        <p className="text-[11px] text-white/70 truncate">{event.location}</p>
      )}
    </article>
  );
}
