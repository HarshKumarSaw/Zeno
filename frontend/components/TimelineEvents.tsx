import React from "react";
import { TimelineEvent } from "../types/event";

// Helps choose color based on colorId
const COLOR_MAP: Record<string, string> = {
  "1": "#EF4444", // Red – Personal
  "2": "#F59E42", // Orange – Work
  "3": "#38BDF8", // Blue – Focus
  "4": "#22C55E", // Green – Wellness
};

const DEFAULT_COLOR = "#6366F1"; // Indigo

type TimelineEventProps = {
  event: TimelineEvent;
};

export default function TimelineEventComponent({ event }: TimelineEventProps) {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const startHour = startDate.getHours() + startDate.getMinutes() / 60;
  const durationMin = (endDate.getTime() - startDate.getTime()) / 60000;

  const top = startHour * 96; // 96 = hour block height
  const height = (durationMin / 60) * 96;

  const bgColor =
    event.colorId && COLOR_MAP[event.colorId]
      ? COLOR_MAP[event.colorId]
      : DEFAULT_COLOR;

  const displayStart = startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const displayEnd = endDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article
      className="absolute left-16 right-4 rounded-lg px-3 py-1.5 text-white text-xs shadow-md overflow-hidden flex flex-col justify-center"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: bgColor,
        zIndex: 10,
      }}
      aria-label={`${event.title}, starts at ${displayStart}, ends at ${displayEnd}`}
      title={event.title}
    >
      <header className="truncate font-semibold text-sm leading-tight">
        {event.title}
      </header>
      {!event.allDay && (
        <time className="opacity-90 text-[11px] leading-snug">
          {displayStart} – {displayEnd}
        </time>
      )}
    </article>
  );
}
