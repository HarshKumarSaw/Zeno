"use client";
import React, { useEffect, useState } from 'react';
import TimelineEventComponent from './TimelineEvents';
import { TimelineEvent } from '../types/event';

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('https://zeno-backend.harshsaw01.workers.dev/api/timelineEvents?user=1&date=2025-08-09');
      const data = await res.json();
      setEvents(data); // <-- the array!
    };
    fetchEvents();
  }, []);

  return (
    <div className="relative h-[2304px] bg-black">
      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className="h-24 border-t border-gray-300 relative">
          <span className="absolute -left-12 text-xs text-gray-500">{`${hour.toString().padStart(2, '0')}:00`}</span>
        </div>
      ))}
      {events.map(event => (
        <TimelineEventComponent key={event.id} event={event} />
      ))}
    </div>
  );
}
