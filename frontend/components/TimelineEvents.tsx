// /components/TimelineEvent.tsx
import React from 'react';
import { TimelineEvent } from '../types/event';
import { getDurationInMinutes, getHourFromISO } from '../utils/time';

interface Props {
  event: TimelineEvent;
}

export default function TimelineEventComponent({ event }: Props) {
  if (event.allDay) {
    return (
      <div className="absolute top-0 left-16 right-4 h-8 border border-dashed bg-white text-xs px-2 py-1 rounded text-gray-700">
        {event.title}
      </div>
    );
  }

  const start = new Date(event.startTime);
  const end = new Date(event.endTime);

  const startHour = start.getHours() + start.getMinutes() / 60;
  const durationInMinutes = getDurationInMinutes(event.startTime, event.endTime);
  const top = (startHour * 96); // 96px = 1 hour (h-24)
  const height = (durationInMinutes / 60) * 96;

  return (
    <div
      className="absolute left-16 right-4 rounded-md px-2 py-1 text-xs text-white overflow-hidden"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: event.color,
      }}
    >
      {event.title}
    </div>
  );
}
