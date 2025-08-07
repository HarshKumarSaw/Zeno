// /components/Timeline.tsx
import React from 'react';

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export default function Timeline() {
  return (
    <div className="h-screen overflow-y-scroll bg-white dark:bg-black">
      <div className="relative border-l border-gray-300 ml-14">
        {hours.map((hour, idx) => (
          <div key={idx} className="h-24 relative">
            <div className="absolute -left-14 text-sm text-gray-500 dark:text-gray-400 w-12 text-right pr-2">
              {hour}
            </div>
            <div className="absolute left-0 right-0 border-t border-dashed border-gray-200 dark:border-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
