// /components/Timeline.tsx

"use client";
import React from 'react';
import TimelineEvents from './TimelineEvents';

// Generate the hour labels (00:00 to 23:00)
const hours = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, '0')}:00`
);

export default function Timeline() {
  return (
    <div className="h-screen overflow-y-scroll bg-white dark:bg-black">
      <div className="relative ml-14 border-l border-gray-300 dark:border-gray-700">
        {/* Timeline hour grid */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-24 relative"
            role="presentation"
          >
            {/* Hour label */}
            <div
              className="absolute -left-14 w-12 pr-2 text-right text-sm text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            >
              {hour}
            </div>
            {/* Hour line */}
            <div className="absolute left-0 right-0 border-t border-dashed border-gray-200 dark:border-gray-700" />
          </div>
        ))}

        {/* Events overlay */}
        <TimelineEvents />
      </div>
    </div>
  );
}
