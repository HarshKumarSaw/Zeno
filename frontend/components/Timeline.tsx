"use client";

import React, { useEffect, useState } from "react";

const HOURS_IN_DAY = 24;
const HOUR_BLOCK_HEIGHT = 96;
const ALL_DAY_HEIGHT = 32;
const MULTI_DAY_HEIGHT = 28;

// Enhanced sample data with all event types
const sampleEvents = [
  // All-day events
  {
    id: "all-1",
    title: "Holiday - Independence Day",
    isAllDay: true,
    startDate: "2025-08-08",
    endDate: "2025-08-08",
    color: "#ef4444",
    type: "holiday"
  },
  {
    id: "all-2",
    title: "Conference Week",
    isAllDay: true,
    startDate: "2025-08-08",
    endDate: "2025-08-10", // Multi-day all-day event
    color: "#8b5cf6",
    type: "conference"
  },
  
  // Regular timed events
  {
    id: "1",
    title: "Morning Standup",
    startTime: "09:00",
    endTime: "09:30",
    description: "Daily team sync",
    color: "#3b82f6",
    type: "meeting"
  },
  
  // Overlapping events (same start time)
  {
    id: "overlap-1",
    title: "Team Meeting A",
    startTime: "10:00",
    endTime: "11:00",
    description: "Engineering team meeting",
    color: "#10b981",
    type: "meeting"
  },
  {
    id: "overlap-2", 
    title: "Design Review",
    startTime: "10:00", // Same start time
    endTime: "10:45",
    description: "UI/UX design review",
    color: "#f59e0b",
    type: "meeting"
  },
  
  // Partially overlapping events
  {
    id: "partial-1",
    title: "Code Review Session",
    startTime: "11:30",
    endTime: "12:30",
    description: "Review PRs",
    color: "#8b5cf6",
    type: "work"
  },
  {
    id: "partial-2",
    title: "Lunch Meeting",
    startTime: "12:00", // Overlaps with above
    endTime: "13:00",
    description: "Business lunch",
    color: "#f97316",
    type: "meeting"
  },
  
  // Multiple simultaneous events
  {
    id: "simul-1",
    title: "Workshop A",
    startTime: "14:00",
    endTime: "15:00",
    description: "Technical workshop",
    color: "#06b6d4",
    type: "workshop"
  },
  {
    id: "simul-2",
    title: "Workshop B", 
    startTime: "14:00", // Exact same time
    endTime: "15:00",
    description: "Design workshop",
    color: "#ec4899",
    type: "workshop"
  },
  {
    id: "simul-3",
    title: "Optional Training",
    startTime: "14:00", // Three events at same time
    endTime: "15:00",
    description: "Skills training",
    color: "#84cc16",
    type: "training"
  },
  
  // Very short events
  {
    id: "short-1",
    title: "Quick Check-in",
    startTime: "15:15",
    endTime: "15:20", // 5 minutes
    description: "Brief sync",
    color: "#f59e0b",
    type: "meeting"
  },
  
  // Long events
  {
    id: "long-1",
    title: "Deep Work Block",
    startTime: "16:00",
    endTime: "18:30",
    description: "Focused development work",
    color: "#10b981",
    type: "work"
  },
  
  // Multi-day timed event (spans midnight)
  {
    id: "multi-1",
    title: "Server Maintenance",
    startTime: "23:00",
    endTime: "02:00", // Next day
    isMultiDay: true,
    startDate: "2025-08-08",
    endDate: "2025-08-09",
    description: "Scheduled maintenance window",
    color: "#ef4444",
    type: "maintenance"
  }
];

// Function to detect overlapping events
function groupOverlappingEvents(events) {
  const timedEvents = events.filter(e => !e.isAllDay);
  const groups = [];
  const processed = new Set();

  timedEvents.forEach(event => {
    if (processed.has(event.id)) return;

    const group = [event];
    processed.add(event.id);

    // Find all overlapping events
    timedEvents.forEach(otherEvent => {
      if (processed.has(otherEvent.id)) return;

      const eventStart = parseTime(event.startTime);
      const eventEnd = parseTime(event.endTime);
      const otherStart = parseTime(otherEvent.startTime);
      const otherEnd = parseTime(otherEvent.endTime);

      // Check for overlap
      if (eventStart < otherEnd && otherStart < eventEnd) {
        group.push(otherEvent);
        processed.add(otherEvent.id);
      }
    });

    groups.push(group);
  });

  return groups;
}

function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + minutes / 60;
}

// All-day events component
function AllDayEventsSection({ events, onEventClick }) {
  const allDayEvents = events.filter(e => e.isAllDay);
  
  if (allDayEvents.length === 0) return null;

  return (
    <div className="border-b border-gray-700 bg-gray-800 bg-opacity-50">
      <div className="px-4 py-2 text-xs text-gray-400 font-medium">All Day</div>
      <div className="px-4 pb-3 space-y-1">
        {allDayEvents.map((event, index) => (
          <div
            key={event.id}
            className="rounded-md p-2 cursor-pointer hover:opacity-80 transition-opacity text-xs font-medium"
            style={{
              backgroundColor: event.color,
              color: 'white'
            }}
            onClick={() => onEventClick(event)}
          >
            <div className="truncate" title={event.title}>
              {event.title}
            </div>
            {event.startDate !== event.endDate && (
              <div className="text-xs opacity-75 mt-1">
                Multi-day event
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced event component for overlapping events
function TimelineEventComponent({ event, onEventClick, groupInfo = null }) {
  const startHour = parseTime(event.startTime);
  const endHour = parseTime(event.endTime);
  const duration = endHour - startHour;

  const top = startHour * HOUR_BLOCK_HEIGHT;
  const actualHeight = duration * HOUR_BLOCK_HEIGHT;
  const minHeight = 50;
  const height = Math.max(actualHeight, minHeight);
  
  const isShortEvent = duration <= 0.5;

  // Calculate positioning for overlapping events
  let leftOffset = 56; // Default left position
  let width = 'calc(100% - 64px)'; // Default width
  
  if (groupInfo) {
    const { index, total, maxConcurrent } = groupInfo;
    const eventWidth = maxConcurrent > 1 ? `calc((100% - 64px) / ${maxConcurrent} - 2px)` : 'calc(100% - 64px)';
    leftOffset = 56 + (index * (100 / maxConcurrent)) + '%';
    width = eventWidth;
  }

  return (
    <div
      className="absolute cursor-pointer group transition-all duration-200 hover:z-30"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: groupInfo ? leftOffset : '56px',
        width: groupInfo ? width : 'calc(100% - 64px)',
        right: groupInfo ? 'auto' : '8px'
      }}
      onClick={() => onEventClick(event)}
    >
      <div
        className="h-full rounded-lg border-l-4 shadow-sm hover:shadow-lg transition-all duration-200 overflow-visible relative"
        style={{
          backgroundColor: `${event.color}20`,
          borderLeftColor: event.color,
          padding: isShortEvent ? '4px 6px' : '8px 8px',
          border: `1px solid ${event.color}40`
        }}
      >
        {event.isMultiDay && (
          <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded-full">
            📅
          </div>
        )}
        
        {isShortEvent ? (
          <div className="flex flex-col justify-center h-full min-h-0">
            <div 
              className="font-semibold text-xs leading-tight truncate"
              style={{ color: event.color }}
              title={event.title}
            >
              {event.title}
            </div>
            <div className="text-xs text-gray-400 leading-tight mt-0.5">
              {event.startTime}-{event.endTime}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div 
              className="font-semibold text-sm leading-tight"
              style={{ color: event.color }}
              title={event.title}
            >
              {event.title.length > 20 ? `${event.title.substring(0, 20)}...` : event.title}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {event.startTime} - {event.endTime}
            </div>
            {height > 80 && event.description && (
              <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                {event.description.length > 50 ? `${event.description.substring(0, 50)}...` : event.description}
              </div>
            )}
          </div>
        )}
        
        {/* Overlap indicator */}
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

function CurrentTimeIndicator({ currentHour, currentMinute }) {
  const currentTimeInHours = currentHour + currentMinute / 60;
  const top = currentTimeInHours * HOUR_BLOCK_HEIGHT;

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
        className="absolute left-0 z-50 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-lg font-medium"
        style={{ 
          top: `${top - 12}px`,
          transform: 'translateX(-2px)'
        }}
      >
        {`${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`}
      </div>
    </>
  );
}

// Conflict indicator for simultaneous events
function ConflictIndicator({ events, top }) {
  if (events.length <= 1) return null;
  
  return (
    <div
      className="absolute right-2 z-30 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg font-bold animate-bounce"
      style={{ top: `${top}px` }}
    >
      ⚠️ {events.length} conflicts
    </div>
  );
}

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'no-conflicts'

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setEvents(sampleEvents);
      } catch (err) {
        setError(err?.message ?? "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setTimeout(() => setSelectedEvent(null), 4000);
  };

  const scrollToCurrentTime = () => {
    const currentHour = currentTime.getHours();
    const element = document.querySelector(`[data-hour="${currentHour}"]`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Group overlapping events
  const overlappingGroups = groupOverlappingEvents(events);
  const conflictCount = overlappingGroups.filter(group => group.length > 1).length;

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-gray-900 text-gray-300 overflow-hidden relative">
      {/* Enhanced Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-lg font-semibold text-white">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric' 
              })}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
              <span>{events.filter(e => !e.isAllDay).length} timed</span>
              <span>{events.filter(e => e.isAllDay).length} all-day</span>
              {conflictCount > 0 && (
                <span className="text-red-400 font-medium">
                  ⚠️ {conflictCount} conflicts
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollToCurrentTime}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white transition-colors"
            >
              Now
            </button>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded-full transition-colors ${
              viewMode === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setViewMode('no-conflicts')}
            className={`px-3 py-1 rounded-full transition-colors ${
              viewMode === 'no-conflicts' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Hide Conflicts
          </button>
        </div>
      </div>

      {/* All-day events section */}
      <AllDayEventsSection events={events} onEventClick={handleEventClick} />

      {/* Event details popup */}
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

      {/* Timeline container */}
      <div className="h-full overflow-y-auto">
        <div
          className="relative w-full border-l border-gray-700"
          style={{ height: HOURS_IN_DAY * HOUR_BLOCK_HEIGHT }}
        >
          {/* Hour blocks */}
          {Array.from({ length: HOURS_IN_DAY }).map((_, hour) => (
            <div
              key={hour}
              data-hour={hour}
              className="relative border-t border-gray-700 flex items-start hover:bg-gray-800 hover:bg-opacity-30 transition-colors"
              style={{ height: HOUR_BLOCK_HEIGHT }}
            >
              <div className="absolute left-0 w-14 text-xs text-gray-500 px-2 pt-1 font-medium">
                {hour === 0 ? '12 AM' : 
                 hour < 12 ? `${hour} AM` : 
                 hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              
              <div className="border-l border-gray-600 flex-1 ml-14 h-full relative">
                <div 
                  className="absolute left-0 w-4 border-t border-gray-700"
                  style={{ top: `${HOUR_BLOCK_HEIGHT / 2}px` }}
                />
                {/* Quarter hour markers */}
                <div 
                  className="absolute left-0 w-2 border-t border-gray-800"
                  style={{ top: `${HOUR_BLOCK_HEIGHT / 4}px` }}
                />
                <div 
                  className="absolute left-0 w-2 border-t border-gray-800"
                  style={{ top: `${(3 * HOUR_BLOCK_HEIGHT) / 4}px` }}
                />
              </div>
            </div>
          ))}

          {/* Current time indicator */}
          <CurrentTimeIndicator 
            currentHour={currentTime.getHours()}
            currentMinute={currentTime.getMinutes()}
          />

          {/* Loading state */}
          {loading && (
            <div className="absolute top-20 left-16 right-4 bg-gray-800 bg-opacity-90 rounded-lg p-4 text-center">
              <div className="text-gray-400">
                <div className="w-6 h-6 bg-blue-600 rounded-full mx-auto mb-2 animate-spin border-2 border-transparent border-t-white"></div>
                Loading all event types...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute top-20 left-16 right-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
              <div className="text-red-400 font-medium text-sm">⚠️ {error}</div>
            </div>
          )}

          {/* Render overlapping event groups */}
          {!loading && !error && overlappingGroups.map((group, groupIndex) => {
            if (viewMode === 'no-conflicts' && group.length > 1) return null;

            if (group.length === 1) {
              // Single event - render normally
              return (
                <TimelineEventComponent
                  key={group[0].id}
                  event={group[0]}
                  onEventClick={handleEventClick}
                />
              );
            } else {
              // Multiple overlapping events
              const maxConcurrent = Math.max(...group.map(event => {
                const start = parseTime(event.startTime);
                const end = parseTime(event.endTime);
                return group.filter(otherEvent => {
                  const otherStart = parseTime(otherEvent.startTime);
                  const otherEnd = parseTime(otherEvent.endTime);
                  return start < otherEnd && otherStart < end;
                }).length;
              }));

              return group.map((event, eventIndex) => (
                <TimelineEventComponent
                  key={event.id}
                  event={event}
                  onEventClick={handleEventClick}
                  groupInfo={{
                    index: eventIndex,
                    total: group.length,
                    maxConcurrent: maxConcurrent
                  }}
                />
              ));
            }
          })}

          {/* Empty state */}
          {!loading && !error && events.length === 0 && (
            <div className="absolute top-20 left-16 right-4 text-center text-gray-500">
              <div className="text-4xl mb-4">📅</div>
              <div className="text-lg font-medium mb-2">No events today</div>
              <div className="text-sm">Your schedule is completely free!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
        }
