// /components/TimelineEvents.tsx
import React from "react";
import { TimelineEvent } from "../types/event";

// Define color codes by category/colorId
const COLOR_MAP: Record<string, string> = {
  "1": "#EF4444", // Red – Personal
  "2": "#F59E42", // Orange – Work
  "3": "#38BDF8", // Blue – Focus
  "4": "#22C55E", // Green – Wellness
};

const DEFAULT_COLOR = "#6366F1"; // Indigo – fallback

type TimelineEventProps = {
  event: TimelineEvent;
};

export default function TimelineEventComponent({ event }: TimelineEventProps) {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  // Positioning & dimensions
  const startHour = startDate.getHours() + startDate.getMinutes() / 60;
  const durationMin = (endDate.getTime() - startDate.getTime()) / 60000;
  const top = startHour * 96; // 96px = per hour block height
  const height = (durationMin / 60) * 96;

  // Color
  const bgColor =
    (event.colorId && COLOR_MAP[event.colorId]) || DEFAULT_COLOR;

  // Display time strings
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
