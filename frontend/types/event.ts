// /types/event.ts

export interface TimelineEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  startUtc?: string;
  endUtc?: string;
  startIso?: string | null;
  endIso?: string | null;
  allDay?: boolean;
  timeZone?: string;
  colorId?: string;
  color?: string;
  location?: string;
  description?: string;
  attendees?: any[]; // Replace 'any' with your Attendee type if needed
  recurringEventId?: string | null;
  durationHours?: number;
  durationDays?: number;
  pinnedTop?: boolean;
}
