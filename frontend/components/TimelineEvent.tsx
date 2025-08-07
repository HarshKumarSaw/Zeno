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

        // Try both {events: []} and [] response styles
        const rawEvents = Array.isArray(data) ? data : data.events;
        const processed: TimelineEvent[] = (rawEvents || []).map((e: any) => ({
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

        setEvents(processed);
      } catch (err) {
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {/* Overly visible banner: remove when working */}
      <div style={{
        background: 'yellow', color: 'black', textAlign: 'center',
        fontWeight: 'bold', padding: 12, fontSize: 16, marginBottom: 10
      }}>
        TIMELINE EVENTS COMPONENT RENDERED!
      </div>
      {/* DEBUG output: events array */}
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
      <div style={{position:"relative"}} className="relative h-[2304px]">
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
            // All-day event — show at the top
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
            <div
              key={id}
              className="absolute left-16 right-4 rounded-md px-3 py-2 text-xs text-white shadow-md overflow-hidden"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: color,
                zIndex: pinnedTop ? 50 : 1,
              }}
            >
              <div className="flex justify-between items-center">
                <strong className="block text-sm font-semibold">
                  {title}
                  {recurringEventId && <span title="Recurring event"> 🔁</span>}
                </strong>
                {durationHours && durationHours > 24 && (
                  <span
                    className="text-[0.6rem] bg-white/30 px-1 rounded ml-2"
                    title={`${Math.round(durationHours)}h`}
                  >
                    ⏳ Multi-day
                  </span>
                )}
                {pinnedTop && <span className="text-yellow-300">📌</span>}
              </div>

              <div className="text-[0.7rem] mt-1">🕓 {formatTimeRange(start, end)}</div>
              {location && <div className="text-[0.7rem] mt-0.5 truncate">📍 {location}</div>}
              {description && (
                <div className="mt-1 text-[0.65rem] line-clamp-2 opacity-90">
                  {description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
