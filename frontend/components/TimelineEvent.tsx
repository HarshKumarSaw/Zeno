// /components/TimelineEvents.tsx

import React, { useEffect, useState } from 'react';
import { TimelineEvent } from '../types/event';

// Helpers
function formatTimeRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(s.getHours())}:${pad(s.getMinutes())}–${pad(e.getHours())}:${pad(e.getMinutes())}`;
}

const COLOR_MAP: Record<string, string> = {
  '1': '#a4bdfc',
  '2': '#7ae7bf',
  '3': '#dbadff',
  '4': '#ff887c',
  '5': '#fbd75b',
  '6': '#ffb878',
  '7': '#46d6db',
  '8': '#e1e1e1',
  '9': '#5484ed',
  '10': '#51b749',
};

export default function TimelineEvents() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          'https://zeno-backend.harshsaw01.workers.dev/api/timelineEvents?user=1&date=2025-08-09'
        );
        const data = await res.json();

        const processed: TimelineEvent[] = data.events.map((e: any) => ({
          id: e.id,
          title: e.title,
          start: e.start,
          end: e.end,
          allDay: e.allDay,
          timeZone: e.timeZone,
          startUtc: e.startUtc,
          endUtc: e.endUtc,
          colorId: e.colorId,
          color: COLOR_MAP[e.colorId] || '#4285F4',
          location: e.location,
          description: e.description,
          attendees: e.attendees,
          recurringEventId: e.recurringEventId,
          pinnedTop: e.pinnedTop,
          durationHours: e.durationHours,
          durationDays: e.durationDays,
        }));

        console.log("TIMELINE EVENTS:", processed);

        setEvents(processed);
      } catch (err) {
        console.error('Error fetching timeline events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="relative h-[2304px]">
      {/* 24 Hour Timeline Grid */}
      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className="h-24 border-t border-gray-300 relative">
          <span className="absolute -left-12 text-xs text-gray-500">
            {`${hour.toString().padStart(2, '0')}:00`}
          </span>
        </div>
      ))}

      {/* Render Events */}
      {events.map((event) => {
        const {
          id,
          title,
          start,
          end,
          allDay,
          color,
          location,
          description,
          durationHours,
          recurringEventId,
          pinnedTop,
        } = event;

        if (allDay) {
          // All-day event — shown pinned at top
          return (
            <div
              key={id}
              className="absolute top-0 left-16 right-4 h-8 border border-dashed bg-white px-3 py-1 rounded text-xs text-gray-700 flex items-center gap-1"
            >
              <strong>{title}</strong>
              {location && <span className="text-[0.65rem]">📍 {location}</span>}
              {recurringEventId && <span title="Recurring event">🔁</span>}
            </div>
          );
        }

        // Timed event
        const startDate = new Date(start);
        const endDate = new Date(end);
        const startHour = startDate.getHours() + startDate.getMinutes() / 60;
        const durationMinutes = (endDate.getTime() - startDate.getTime()) / 60000;
        const top = startHour * 96;
        const height = (durationMinutes / 60) * 96;

        return (
  <div>
    {/* Debug box: shows fetched events as JSON */}
    <pre style={{
      fontSize: 10, 
      background: "#eef", 
      color: "#222", 
      padding: 6, 
      maxHeight: 100, 
      overflow: "auto"
    }}>
      {JSON.stringify(events, null, 2)}
    </pre>
    {/* The timeline UI */}
    <div className="relative h-[2304px]">
      {/* 24 Hour Timeline Grid */}
      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className="h-24 border-t border-gray-300 relative">
          <span className="absolute -left-12 text-xs text-gray-500">
            {`${hour.toString().padStart(2, '0')}:00`}
          </span>
        </div>
      ))}

      {/* Render Events */}
      {events.map((event) => {
        // (event box rendering logic stays the same)
        // ...
      })}
    </div>
  </div>
);
