// /types/event.ts
export interface TimelineEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  summary: string;
  allDay?: boolean;
  timeZone?: string;
  startUtc?: string;
  endUtc?: string;
  colorId?: string;
  color?: string;
  location?: string;
  description?: string;
  attendees?: any[];
  recurringEventId?: string | null;
  pinnedTop?: boolean;
  durationHours?: number;
  durationDays?: number;
}
