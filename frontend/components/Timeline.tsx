"use client";

import React, { useEffect, useState } from "react";
import TimelineEventComponent from "./TimelineEvents";
import { TimelineEvent } from "../types/event";

const HOURS_IN_DAY = 24;
const HOUR_BLOCK_HEIGHT = 96; // 24px * 4 for height per hour block, adjust as needed

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://zeno-backend.harshsaw01.workers.dev/api/timelineEvents?user=1&date=2025-08-09"
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data: TimelineEvent[] = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="w-full max-w-md mx-auto h-screen bg-black text-gray-300 overflow-y-auto relative select-none">
      {/* Timeline container with fixed height for scroll */}
      <div
        className="relative w-full border border-gray-800"
        style={{ height: HOURS_IN_DAY * HOUR_BLOCK_HEIGHT }}
        aria-label="24-hour timeline"
        role="list"
      >
        {/* Render hour rows */}
        {Array.from({ length: HOURS_IN_DAY }).map((_, hour) => (
          <div
            key={hour}
            className="relative border-t border-gray-700 flex items-center"
            style={{ height: HOUR_BLOCK_HEIGHT }}
          >
            <time
              className="absolute left-0 w-12 text-xs text-gray-500 px-2 select-text"
              dateTime={`${hour.toString().padStart(2, "0")}:00`}
              aria-label={`${hour} o'clock`}
            >
              {`${hour.toString().padStart(2, "0")}:00`}
            </time>
            <div className="border-l border-gray-700 flex-1 ml-14 h-full" />
          </div>
        ))}

        {/* Loading and Error messages */}
        {loading && (
          <div className="absolute top-5 left-20 text-gray-400 font-medium select-text">
            Loading events...
          </div>
        )}
        {error && (
          <div className="absolute top-5 left-20 text-red-500 font-medium select-text">
            Error: {error}
          </div>
        )}

        {/* Render events positioned absolutely */}
        {!loading &&
          !error &&
          events.map((event) => (
            <TimelineEventComponent
              key={event.id}
              event={event}
              containerHeight={HOURS_IN_DAY * HOUR_BLOCK_HEIGHT}
            />
          ))}
      </div>
    </main>
  );
}
