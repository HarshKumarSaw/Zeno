// /components/TimelineEvents.tsx

import React from "react";
import { TimelineEvent } from "../types/event";

// Helps choose colors based on colorId
const COLOR_MAP: Record<string, string> = {
  "1": "#EF4444", // Red
  "2": "#F59E42", // Orange
  "3": "#38BDF8", // Blue
  "4": "#22C55E", // Green
};
const DEFAULT_COLOR = "#6366F1";

type TimelineEventProps = {
  event: TimelineEvent;
};

// Main event card component
export default function TimelineEventComponent({ event }: TimelineEventProps) {
  // Compute times/duration/placement
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const startHour = startDate.getHours() + startDate.getMinutes() / 60;
  const durationMin = (endDate.getTime() - startDate.getTime()) / 60000;
  const top = startHour * 96;
  const height = (durationMin / 60) * 96;
  const bgColor = event.colorId
    ? COLOR_MAP[event.colorId] || DEFAULT_COLOR
    : DEFAULT_COLOR;

  // Start/end for display (HH:mm)
  const displayStart = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const displayEnd = endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="absolute left-16 right-4 rounded-md px-2 py-1 text-xs text-white overflow-hidden shadow-md"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: bgColor,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      title={event.title}
    >
      <div style={{ fontWeight: 600, fontSize: 14 }}>{event.title}</div>
      {!event.allDay && (
        <div style={{ fontSize: 12, opacity: 0.85 }}>
          {displayStart} – {displayEnd}
          
