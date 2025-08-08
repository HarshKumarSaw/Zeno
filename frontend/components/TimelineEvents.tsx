import React from 'react';
import { TimelineEvent } from '../types/event';

interface Props {
  event: TimelineEvent;
}

export default function TimelineEventComponent({ event }: Props) {
  // Always render a VERY noticeable debug box for every event
  return (
    <div
      style={{
        position: 'absolute',
        left: 200,
        top: 200,
        width: 200,
        height: 40,
        background: 'orange',
        color: 'black',
        zIndex: 2000,
        border: '2px solid aqua',
        fontWeight: 'bold',
        fontSize: 16,
        boxShadow: '0 0 12px 2px #ff0'
      }}
    >
      DEBUG: {event.title}
    </div>
  );
}
