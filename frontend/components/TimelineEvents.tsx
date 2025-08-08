import React from "react";
import { TimelineEvent } from "../types/event";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const COLOR_MAP: Record<string, string> = {
  "1": "#EF4444",
  "2": "#F59E42",
  "3": "#38BDF8",
  "4": "#22C55E",
};
const DEFAULT_COLOR = "#6366F1";
const HOUR_BLOCK_HEIGHT = 96;
const TIMEZONE = "Asia/Kolkata";

type TimelineEventProps = {
  event: TimelineEvent;
};

export default function TimelineEventComponent({ event }: TimelineEventProps) {
  // Use UTC fields for timezone-safe math and display
  const start = dayjs.tz(event.startUtc, TIMEZONE);
  const end = dayjs.tz(event.endUtc, TIMEZONE);

  const startHour = start.hour() + start.minute() / 60;
  const durationMin = end.diff(start, "minute");
  const top = startHour * HOUR_BLOCK_HEIGHT;
  const height = (durationMin / 60) * HOUR_BLOCK_HEIGHT;

  const bgColor =
    (event.colorId && COLOR_MAP[event.colorId]) || DEFAULT_COLOR;

  const displayStart = start.format("HH:mm");
  const displayEnd = end.format("HH:mm");

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
