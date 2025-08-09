"use client";

import React, { useState, useEffect, useRef } from "react";

/* ------------------ CONSTANTS ------------------ */
const HOURS_IN_DAY = 24;
const HOUR_BLOCK_HEIGHT = 96; // px
const TIMELINE_WIDTH = 448;   // Tailwind max-w-md = 28rem = 448px
const LABEL_WIDTH = 56;       // px; for hour labels
const RIGHT_GUTTER = 8;       // px

/* ------------------ TYPES ------------------ */
type Event = {
  id: string;
  title: string;
  isAllDay?: boolean;
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  color: string;
  type?: string;
  isMultiDay?: boolean;
};

/* ------------------ SAMPLE EVENTS ------------------ */
const sampleEvents: Event[] = [
  { id: "all-1", title: "Holiday - Independence Day", isAllDay: true, startDate: "2025-08-15", endDate: "2025-08-15", color: "#ef4444", type: "holiday" },
  { id: "all-2", title: "Intl. Hackathon", isAllDay: true, startDate: "2025-08-12", endDate: "2025-08-16", color: "#8b5cf6", type: "conference" },
  { id: "timed-1", title: "Morning Standup", startTime: "09:00", endTime: "09:30", description: "Daily team sync", color: "#0ea5e9", type: "meeting" },
  { id: "timed-2a", title: "Product Review", startTime: "09:30", endTime: "10:00", description: "Feedback session", color: "#f59e42", type: "meeting" },
  { id: "timed-2b", title: "One-on-One", startTime: "10:00", endTime: "10:30", description: "Mentoring", color: "#3b82f6", type: "1-1" },
  { id: "overlap-a", title: "Parallel Meeting A", startTime: "11:00", endTime: "12:00", color: "#10b981", type: "meeting" },
  { id: "overlap-b", title: "Parallel Meeting B", startTime: "11:15", endTime: "12:30", color: "#f59e0b", type: "meeting" },
  { id: "overlap-c1", title: "Workshop A", startTime: "14:00", endTime: "15:00", color: "#06b6d4", type: "workshop" },
  { id: "overlap-c2", title: "Workshop B", startTime: "14:00", endTime: "15:00", color: "#ec4899", type: "workshop" },
  { id: "overlap-c3", title: "Optional Training", startTime: "14:00", endTime: "15:00", color: "#84cc16", type: "training" },
  { id: "short-1", title: "Quick Sync", startTime: "15:15", endTime: "15:20", color: "#f59e0b", type: "meeting" },
  { id: "long-1", title: "Deep Work Block", startTime: "16:00", endTime: "18:30", color: "#10b981", type: "work" },
  { id: "multi-1", title: "Server Maintenance", startTime: "23:00", endTime: "02:00", startDate: "2025-08-11", endDate: "2025-08-12", isMultiDay: true, color: "#ef4444", type: "maintenance" },
];

/* ------------------ HELPERS ------------------ */
function parseTime(timeStr = "00:00") {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
}

function groupOverlappingEvents(events: Event[]) {
  const timedEvents = events.filter(e => !e.isAllDay);
  const groups: Event[][] = [];
  const processed = new Set<string>();

  timedEvents.forEach(event => {
    if (processed.has(event.id)) return;
    const group = [event];
    processed.add(event.id);

    const eventStart = parseTime(event.startTime);
    const eventEnd = parseTime(event.endTime) + (event.isMultiDay && parseTime(event.endTime) < parseTime(event.startTime) ? 24 : 0);

    timedEvents.forEach(otherEvent => {
      if (processed.has(otherEvent.id) || otherEvent.id === event.id) return;
      const otherStart = parseTime(otherEvent.startTime);
      const otherEnd = parseTime(otherEvent.endTime) + (otherEvent.isMultiDay && parseTime(otherEvent.endTime) < parseTime(otherEvent.startTime) ? 24 : 0);
      if (eventStart < otherEnd && otherStart < eventEnd) {
        group.push(otherEvent);
        processed.add(otherEvent.id);
      }
    });
    groups.push(group);
  });
  return groups;
}

/* ------------------ COMPONENTS ------------------ */
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
            {event.startDate && event.endDate && event.startDate !== event.endDate && (
              <div className="text-xs opacity-75 mt-1">Multi-day event</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineEventComponent({
  event,
  onEventClick,
  groupInfo
}: {
  event: Event;
  onEventClick: (e: Event) => void;
  groupInfo?: { index: number; total: number; maxConcurrent: number };
}) {
  const startHour = parseTime(event.startTime);
  let endHour = parseTime(event.endTime);
  if (event.isMultiDay && endHour < startHour) endHour += 24;
  const duration = endHour - startHour;
  const top = startHour * HOUR_BLOCK_HEIGHT;
  const height = Math.max(duration * HOUR_BLOCK_HEIGHT, 38);

  let width = TIMELINE_WIDTH - LABEL_WIDTH - RIGHT_GUTTER - 1;
  let left = LABEL_WIDTH;
  if (groupInfo) {
    const maxC = groupInfo.maxConcurrent || groupInfo.total;
    width = Math.floor((TIMELINE_WIDTH - LABEL_WIDTH - RIGHT_GUTTER - 1) / maxC) - 2;
    left = LABEL_WIDTH + (groupInfo.index * (width + 2));
  }

  return (
    <div
      className="absolute cursor-pointer group transition-all duration-200 hover:z-30"
      style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` }}
      onClick={() => onEventClick(event)}
    >
      <div
        className="h-full rounded-lg border-l-4 shadow-sm hover:shadow-lg relative bg-opacity-90"
        style={{
          backgroundColor: `${event.color}22`,
          borderLeftColor: event.color,
          padding: duration <= 0.5 ? "4px 6px" : "8px 8px",
          border: `1px solid ${event.color}33`
        }}
      >
        <div className="font-semibold text-sm truncate" style={{ color: event.color }} title={event.title}>
          {event.title.length > 20 ? `${event.title.substring(0, 20)}...` : event.title}
        </div>
        <div className="text-xs text-gray-400">
          {event.startTime} - {event.endTime}
        </div>
      </div>
    </div>
  );
}

function CurrentTimeIndicator({ currentHour, currentMinute }: { currentHour: number, currentMinute: number }) {
  const now = currentHour + currentMinute / 60;
  const top = now * HOUR_BLOCK_HEIGHT;
  return (
    <>
      <div className="absolute left-0 right-0 z-40 flex items-center" style={{ top: `${top}px` }}>
        <div className="w-14 flex justify-center">
          <div className="bg-red-500 rounded-full w-3 h-3 border-2 border-white animate-pulse" />
        </div>
        <div className="flex-1 h-0.5 bg-red-500 mr-2" />
      </div>
      <div
        className="absolute left-0 z-50 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-lg"
        style={{ top: `${top - 12}px`, transform: "translateX(-2px)" }}
      >
        {`${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`}
      </div>
    </>
  );
}

/* ------------------ MAIN TIMELINE ------------------ */
export default function Timeline() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    setEvents(sampleEvents);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const overlappingGroups = groupOverlappingEvents(events);

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-gray-900 text-gray-300 overflow-hidden relative">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between">
        {currentTime ? (
          <h1 className="text-lg font-semibold text-white">
            {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </h1>
        ) : (
          <h1 className="text-lg font-semibold text-white">Loading...</h1>
        )}
      </div>

      {/* All-day events */}
      <AllDayEventsSection events={events} onEventClick={setSelectedEvent} />

      {/* Timeline body */}
      <div className="h-full overflow-y-auto">
        <div
          className="relative w-full mx-auto"
          style={{ width: `${TIMELINE_WIDTH}px`, height: HOURS_IN_DAY * HOUR_BLOCK_HEIGHT }}
        >
          {Array.from({ length: HOURS_IN_DAY }).map((_, hour) => (
            <div key={hour} data-hour={hour} className="relative border-t border-gray-700" style={{ height: HOUR_BLOCK_HEIGHT }}>
              <div className="absolute left-0 w-14 text-xs text-gray-500 px-2 pt-1">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
            </div>
          ))}

          {currentTime && (
            <CurrentTimeIndicator currentHour={currentTime.getHours()} currentMinute={currentTime.getMinutes()} />
          )}

          {overlappingGroups.map(group => {
            if (group.length === 1) {
              return <TimelineEventComponent key={group[0].id} event={group[0]} onEventClick={setSelectedEvent} />;
            }
            const maxConcurrent = Math.max(
              ...group.map(event => {
                const start = parseTime(event.startTime);
                const end = parseTime(event.endTime) + ((event.isMultiDay && parseTime(event.endTime) < parseTime(event.startTime)) ? 24 : 0);
                return group.filter(other => {
                  const otherStart = parseTime(other.startTime);
                  const otherEnd = parseTime(other.endTime) + ((other.isMultiDay && parseTime(other.endTime) < parseTime(other.startTime)) ? 24 : 0);
                  return start < otherEnd && otherStart < end;
                }).length;
              })
            );
            return group.map((event, index) => (
              <TimelineEventComponent
                key={event.id}
                event={event}
                onEventClick={setSelectedEvent}
                groupInfo={{ index, total: group.length, maxConcurrent }}
              />
            ));
          })}
        </div>
      </div>
    </div>
  );
}