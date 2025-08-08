"use client";
import React, { useEffect, useState } from "react";
import TimelineEventComponent from "./TimelineEvents";
import { TimelineEvent } from "../types/event";

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
    <div className="relative h-[2304px] bg-black">
      {/* Render time grid */}
      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className="h-24 border-t border-gray-600 relative">
          <span className="absolute -left-12 text-xs text-gray-400">
            {`${hour.toString().padStart(2, "0")}:00`}
          </span>
        </div>
      ))}

      {loading && (
        <div className="absolute left-20 top-12 text-gray-400">Loading events...</div>
      )}
      {error && (
        <div className="absolute left-20 top-12 text-red-400">Error: {error}</div>
      )}

      {/* Render events */}
      {!loading &&
        !error &&
        events.map((event) => (
          <TimelineEventComponent key={event.id} event={event} />
        ))}
    </div>
  );
}
