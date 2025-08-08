"use client";

import React, { useEffect, useState } from "react";

// Config
const HOURS_IN_DAY = 24;
const HOUR_BLOCK_HEIGHT = 96;

// Event Type
type Event = {
  id: string;
  title: string;
  isAllDay?: boolean;
  startTime?: string;   // "HH:mm"
  endTime?: string;     // "HH:mm"
  startDate?: string;   // "YYYY-MM-DD"
  endDate?: string;     // "YYYY-MM-DD"
  description?: string;
  color: string;
  type?: string;
  isMultiDay?: boolean;
};

// 🟦 Multifunctional, Diverse Event Samples 😎
const sampleEvents: Event[] = [
  // --- All-day events (single, multi-day) ---
  {
    id: "all-1",
    title: "Holiday - Independence Day",
    isAllDay: true,
    startDate: "2025-08-15",
    endDate: "2025-08-15",
    color: "#ef4444",
    type: "holiday"
  },
  {
    id: "all-2",
    title: "Intl. Hackathon",
    isAllDay: true,
    startDate: "2025-08-12",
    endDate: "2025-08-16",
    color: "#8b5cf6",
    type: "conference"
  },

  // --- Regular event (non-overlapping) ---
  {
    id: "timed-1",
    title: "Morning Standup",
    startTime: "09:00",
    endTime: "09:30",
    description: "Daily team sync",
    color: "#0ea5e9",
    type: "meeting"
  },

  // --- Back-to-back helper events (test stacking) ---
  {
    id: "timed-2a",
    title: "Product Review",
    startTime: "09:30",
    endTime: "10:00",
    description: "Feedback session",
    color: "#f59e42",
    type: "meeting"
  },
  {
    id: "timed-2b",
    title: "One-on-One",
    startTime: "10:00",
    endTime: "10:30",
    description: "Mentoring",
    color: "#3b82f6",
    type: "1-1"
  },

  // --- Overlapping events (same time, different length) ---
  {
    id: "overlap-a",
    title: "Parallel Meeting A",
    startTime: "11:00",
    endTime: "12:00",
    color: "#10b981",
    type: "meeting"
  },
  {
    id: "overlap-b",
    title: "Parallel Meeting B",
    startTime: "11:15",
    endTime: "12:30",
    color: "#f59e0b",
    type: "meeting"
  },

  // --- Three events at same time (overlap) ---
  {
    id: "overlap-c1",
    title: "Workshop A",
    startTime: "14:00",
    endTime: "15:00",
    color: "#06b6d4",
    type: "workshop"
  },
  {
    id: "overlap-c2",
    title: "Workshop B",
    startTime: "14:00",
    endTime: "15:00",
    color: "#ec4899",
    type: "workshop"
  },
  {
    id: "overlap-c3",
    title: "Optional Training",
    startTime: "14:00",
    endTime: "15:00",
    color: "#84cc16",
    type: "training"
  },

  // --- Very short (5 min) event ---
  {
    id: "short-1",
    title: "Quick Sync",
    startTime: "15:15",
    endTime: "15:20",
    color: "#f59e0b",
    type: "meeting"
  },

  // --- Long session ---
  {
    id: "long-1",
    title: "Deep Work Block",
    startTime: "16:00",
    endTime: "18:30",
    color: "#10b981",
    type: "work"
  },

  // --- Multi-day timed event (spans midnight) ---
  {
    id: "multi-1",
    title: "Server Maintenance",
    startTime: "23:00",
    endTime: "02:00", // Next day
    startDate: "2025-08-11",
    endDate: "2025-08-12",
    isMultiDay: true,
    color: "#ef4444",
    type: "maintenance"
  }
];

// Helper for time parsing "HH:mm" → decimal hours
function parseTime(timeStr?: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + (minutes / 60);
}

// Group overlapping events function
function groupOverlappingEvents(events: Event[]) {
  const timedEvents = events.filter(e => !e.isAllDay);
  const groups: Event[][] = [];
  const processed = new Set<string>();

  timedEvents.forEach(event => {
    if (processed.has(event.id)) return;

    const group = [event];
    processed.add(event.id);
    const eventStart = parseTime(event.startTime);
    const eventEnd = parseTime(event.endTime);

    timedEvents.forEach(otherEvent => {
      if (processed.has(otherEvent.id)) return;
      const otherStart = parseTime(otherEvent.startTime);
      const otherEnd = parseTime(otherEvent.endTime);
      if (eventStart < otherEnd && otherStart < eventEnd) {
        group.push(otherEvent);
        processed.add(otherEvent.id);
      }
    });
    groups.push(group);
  });
  return groups;
}

// All-day events header renderer
function AllDayEventsSection({ events, onEventClick }: { events: Event[], onEventClick: (e: Event) => void }) {
  const allDayEvents = events.filter(e => e.isAllDay);
  if (!allDayEvents.length) return null;
  return (
    <div className="border-b border-gray-700 bg-gray-800 bg-opacity-50">
      <div className="px-4 py-2 text-xs text-gray-400 font-medium">All Day</div>
      <div className="px-4 pb-3 space-y-1">
        {allDayEvents.map(event => (
          <div
            key={event.id}
            onClick={() => onEventClick(event)}
            className="rounded-md p-2 cursor-pointer hover:opacity-80 transition-opacity text-xs font-medium"
            style={{ backgroundColor: event.color, color: "white" }}
          >
            <span className="truncate" title={event.title}>{event.title}</span>
            {event.startDate !== event.endDate && (
              <div className="text-xs opacity-75 mt-1">Multi-day event</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Timeline event component
function TimelineEventComponent({
  event,
  onEventClick,
  groupInfo
}: {
  event: Event;
  onEventClick: (e: Event) => void;
  groupInfo?: { index: number; total: number; maxConcurrent: number }
}) {
  const startHour = parseTime(event.startTime);
  // Support midnight-spanning events
  let endHour = parseTime(event.endTime);
  if (event.isMultiDay && endHour < startHour) endHour += 24;

  const duration = endHour - startHour;
  const top = startHour * HOUR_BLOCK_HEIGHT;
  const height = Math.max(duration * HOUR_BLOCK_HEIGHT, 38);
  const isShortEvent = duration <= 0.5;

  // Overlap positioning and sizing
  let left = 56;
  let width = "calc(100% - 64px)";
  if (groupInfo) {
    const maxC = groupInfo.maxConcurrent || groupInfo.total;
    width = `calc((100% - 64px) / ${maxC} - 2px)`;
    left = 56 + groupInfo.index * (320 / maxC);
  }

  return (
    <div
      className="absolute cursor-pointer group transition-all duration-200 hover:z-30"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: groupInfo ? `${left}px` : "56px",
        width: groupInfo ? width : "calc(100% - 64px)",
        right: groupInfo ? "auto" : "8px"
      }}
      onClick={() => onEventClick(event)}
      key={event.id}
    >
      <div
        className="h-full rounded-lg border-l-4 shadow-sm hover:shadow-lg transition-all duration-200 overflow-visible relative bg-opacity-90"
        style={{
          backgroundColor: `${event.color}22`,
          borderLeftColor: event.color,
          padding: isShortEvent ? "4px 6px" : "8px 8px",
          border: `1px solid ${event.color}33`
        }}
      >
        {event.isMultiDay && (
          <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded-full">
            📅
          </div>
        )}
        <div className="flex flex-col">
          <div
            className="font-semibold text-sm leading-tight truncate"
            style={{ color: event.color }}
            title={event.title}
          >
            {event.title.length > 20 ? `${event.title.substring(0, 20)}...` : event.title}
          </div>
          <div className="text-xs text-gray-400">
            {event.startTime} - {event.endTime}
          </div>
          {height > 70 && event.description && (
            <div className="text-xs text-gray-500 mt-2 leading-relaxed">
              {event.description.length > 50
                ? `${event.description.substring(0, 50)}...`
                : event.description}
            </div>
          )}
        </div>
        {groupInfo && groupInfo.total > 1 && (
          <div className="absolute -top-1 -left-1 bg-yellow-500 text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {groupInfo.total}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
      </div>
    </div>
  );
}

// Red "Now" indicator
function CurrentTimeIndicator({ currentHour, currentMinute }: { currentHour: number, currentMinute: number }) {
  const now = currentHour + currentMinute / 60;
  const top = now * HOUR_BLOCK_HEIGHT;
  return (
    <>
      <div
        className="absolute left-0 right-0 z-40 flex items-center"
        style={{ top: `${top}px` }}
      >
        <div className="w-14 flex justify-center">
          <div className="bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-sm animate-pulse" />
        </div>
        <div className="flex-1 h-0.5 bg-red-500 mr-2" />
      </div>
      <div
        className="absolute left-0 z-50 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-lg font-medium select-none"
        style={{
          top: `${top - 12}px`,
          transform: "translateX(-2px)"
        }}
      >
        {`${currentHour.toString().padStart(2, "0")}:${currentMinute
          .toString()
          .padStart(2, "0")}`}
      </div>
    </>
  );
}

export default function Timeline() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    setEvents(sampleEvents);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setTimeout(() => setSelectedEvent(null), 4000);
  };

  // Grouping
  const overlappingGroups = groupOverlappingEvents(events);

  // Scroll to now
  const scrollToCurrentTime = () => {
    const currentHour = currentTime.getHours();
    const element = document.querySelector(`[data-hour="${currentHour}"]`);
    if (element) (element as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-gray-900 text-gray-300 overflow-hidden relative">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-lg font-semibold text-white">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h1>
          </div>
          <button
            onClick={scrollToCurrentTime}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white transition-colors"
          >
            Now
          </button>
        </div>
      </div>

      {/* All-day events */}
      <AllDayEventsSection events={events} onEventClick={handleEventClick} />

      {/* Popup */}
      {selectedEvent && (
        <div className="absolute top-32 left-4 right-4 z-50 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white" style={{ color: selectedEvent.color }}>
              {selectedEvent.title}
            </h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>
          {selectedEvent.isAllDay ? (
            <p className="text-sm text-gray-300 mb-2">All-day event</p>
          ) : (
            <p className="text-sm text-gray-300 mb-2">
              {selectedEvent.startTime} - {selectedEvent.endTime}
            </p>
          )}
          {selectedEvent.description && (
            <p className="text-sm text-gray-400">{selectedEvent.description}</p>
          )}
          {selectedEvent.isMultiDay && (
            <div className="mt-2 text-xs text-orange-400 bg-orange-900 bg-opacity-20 px-2 py-1 rounded">
              📅 Multi-day event
            </div>
          )}
          <div className="mt-3 text-xs text-gray-500 capitalize">
            Type: {selectedEvent.type}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="h-full overflow-y-auto">
        <div className="relative w-full border-l border-gray-700" style={{ height: HOURS_IN_DAY * HOUR_BLOCK_HEIGHT }}>
          {/* Grid hours */}
          {Array.from({ length: HOURS_IN_DAY }).map((_, hour) => (
            <div
              key={hour}
              data-hour={hour}
              className="relative border-t border-gray-700 flex items-start hover:bg-gray-800 hover:bg-opacity-30 transition-colors"
              style={{ height: HOUR_BLOCK_HEIGHT }}
            >
              <div className="absolute left-0 w-14 text-xs text-gray-500 px-2 pt-1 font-medium">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
              </div>
              <div className="border-l border-gray-600 flex-1 ml-14 h-full relative">
                <div className="absolute left-0 w-4 border-t border-gray-700" style={{ top: `${HOUR_BLOCK_HEIGHT / 2}px` }} />
                <div className="absolute left-0 w-2 border-t border-gray-800" style={{ top: `${HOUR_BLOCK_HEIGHT / 4}px` }} />
                <div className="absolute left-0 w-2 border-t border-gray-800" style={{ top: `${(3 * HOUR_BLOCK_HEIGHT) / 4}px` }} />
              </div>
            </div>
          ))}

          {/* Now marker */}
          <CurrentTimeIndicator
            currentHour={currentTime.getHours()}
            currentMinute={currentTime.getMinutes()}
          />

          {/* Render overlapping groups, side-by-side */}
          {overlappingGroups.map((group, idx) => {
            if (group.length === 1) {
              return (
                <TimelineEventComponent
                  key={group[0].id}
                  event={group[0]}
                  onEventClick={handleEventClick}
                />
              );
            } else {
              const maxConcurrent = Math.max(
                ...group.map(event => {
                  const start = parseTime(event.startTime);
                  const end = parseTime(event.endTime);
                  return group.filter(otherEvent => {
                    const otherStart = parseTime(otherEvent.startTime);
                    const otherEnd = parseTime(otherEvent.endTime);
                    return start < otherEnd && otherStart < end;
                  }).length;
                })
              );
              return group.map((event, eventIndex) => (
                <TimelineEventComponent
                  key={event.id}
                  event={event}
                  onEventClick={handleEventClick}
                  groupInfo={{
                    index: eventIndex,
                    total: group.length,
                    maxConcurrent
                  }}
                />
              ));
            }
          })}
        </div>
      </div>
    </div>
  );
          }
