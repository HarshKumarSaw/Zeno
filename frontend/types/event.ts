// /types/event.ts

export interface TimelineEvent {
  id: string;
  start: string; // ISO timestamp, e.g. "2025-08-07T10:30:00Z"
  end: string;   // ISO timestamp
  title: string;
  location?: string;
  color?: string; // (e.g. "#4285F4" from Google Calendar)
  description?: string;
}
