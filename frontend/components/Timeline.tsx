// /components/Timeline.tsx
import React, { useEffect, useState } from 'react';
import TimelineEventComponent from './TimelineEvents';
import { TimelineEvent } from '../types/event';

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          'https://zeno-backend.harshsaw01.workers.dev/api/timelineEvents?user=1&date=2025-08-09'
        );
        const data = await res.json();
        setEvents(data.events); // Assuming the API returns { events: [...] }
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="relative h-[2304px]"> {/* 96px x 24h */}
      {/* Hour markers */}
      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className="h-24 border-t border-gray-300 relative">
          <span className="absolute -left-12 text-xs text-gray-500">{`${hour.toString().padStart(2, '0')}:00`}</span>
        </div>
      ))}

      {/* Timeline Events */}
      {events.map(event => (
        <TimelineEventComponent key={event.id} event={event} />
      ))}
    </div>
  );
}
