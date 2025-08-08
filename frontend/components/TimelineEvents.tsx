import React from 'react';
import { TimelineEvent } from '../types/event';

// Map colorId to a background color
const colorMap: { [id: string]: string } = {
  "1": "#EF4444", // red
  "2": "#F59E42", // orange
  "3": "#38BDF8", // blue
  "4": "#22C55E", // green
};
const defaultColor = '#6366F1';

interface Props {
  event: TimelineEvent;
}

export default function TimelineEventComponent({ event }: Props) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const startHour = start.getHours() + start.getMinutes() / 60;
  const duration = (end.getTime() - start.getTime()) / 60000; // in minutes
  const top = startHour * 96;
  const height = (duration / 60) * 96;
  const bgColor = event.colorId ? (colorMap[event.colorId] || defaultColor) : defaultColor;

  return (
    <div
      className="absolute left-16 right-4 rounded-md px-2 py-1 text-xs text-white overflow-hidden shadow-md"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: bgColor,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14 }}>{event.title}</div>
      <div style={{ fontSize: 12, opacity: 0.85 }}>
        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
