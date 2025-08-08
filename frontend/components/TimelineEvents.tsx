import React from 'react';
import { TimelineEvent } from '../types/event';

interface Props {
  event: TimelineEvent;
}

export default function TimelineEventComponent({ event }: Props) {
  // Calculate position from event.start and event.end
  const start = new Date(event.start);
  const end = new Date(event.end);
  const startHour = start.getHours() + start.getMinutes() / 60;
  const durationInMinutes = (end.getTime() - start.getTime()) / 60000;
  const top = startHour * 96; // 96px per hour (adjust if your grid is different)
  const height = (durationInMinutes / 60) * 96;

  // To debug visually, we use a bright color and a border
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 20,
        top: `${top}px`,
        height: `${height}px`,
        background: 'orange',
        color: 'black',
        border: '2px solid aqua',
        fontWeight: 'bold',
        fontSize: 16,
        boxShadow: '0 0 12px 2px #ff0',
        zIndex: 2000,
        padding: 8,
      }}
    >
      DEBUG: {event.title}
      <div style={{ fontSize: 12, fontWeight: 400 }}>
        ({start.toLocaleTimeString()} - {end.toLocaleTimeString()})
      </div>
    </div>
  );
}
