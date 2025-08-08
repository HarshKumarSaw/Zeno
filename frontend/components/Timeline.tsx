"use client";
import React, { useEffect, useState } from 'react';
import TimelineEventComponent from './TimelineEvent';
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
        setEvents(data.events);
        console.log('Fetched events:', data.events); // Visual debug log
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="relative h-[2304px] bg-black">
      {/* Visual debug: show raw events */}
      <pre style={{
        color: 'lime',
        background: 'rgba(0,0,0,0.6)',
        position: 'sticky',
        top: 0,
        zIndex: 5000,
        maxHeight: 200,
        overflowY: 'auto'
      }}>
        {JSON.stringify(events, null, 2)}
      </pre>

      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className="h-24 border-t border-gray-300 relative">
          <span className="absolute -left-12 text-xs text-gray-500">{`${hour.toString().padStart(2, '0')}:00`}</span>
        </div>
      ))}

      {/* Visual debug: log each event render */}
      {events.map(event => {
        console.log('Rendering event:', event);
        return (
          <TimelineEventComponent key={event.id} event={event} />
        );
      })}

      {/* Visual debug: always-visible guide box */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 120,
          zIndex: 9999,
          background: "red",
          color: "white",
          padding: 4,
        }}
      >
        Debug box (should always be visible)
      </div>
    </div>
  );
}
