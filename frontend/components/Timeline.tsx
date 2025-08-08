"use client";
import React, { useState } from 'react';
import TimelineEventComponent from './TimelineEvents';
import { TimelineEvent } from '../types/event';

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: 'hardcoded-1',
      title: 'Sample Event',
      start: '2025-08-09T14:00:00+05:30',
      end: '2025-08-09T16:00:00+05:30',
      colorId: '4',
      allDay: false
    }
  ]);

  return (
    <div className="relative h-[2304px] bg-black">
      {/* Debug output */}
      <pre style={{
        color: 'lime',
        background: 'rgba(0,0,0,0.8)',
        padding: 8,
        maxHeight: 200,
        overflowY: 'auto',
        fontSize: 10,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {JSON.stringify(events, null, 2)}
      </pre>

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
