// /types/event.ts

export interface TimelineEvent {
  id: string;
  recurringEventId: string | null;
  title: string;
  start: string;                // ISO string (dateTime if not allDay, else date in YYYY-MM-DD)
  end: string;                  // ISO string (same as above)
  startUtc: string | null;      // UTC ISO string if timed, else null
  endUtc: string | null;        // UTC ISO string if timed, else null
  startIso: string | null;      // Localized ISO for all-day, else null
  endIso: string | null;        // Localized ISO for all-day, else null
  allDay: boolean;
  colorId: string | null;
  location: string | null;
  timeZone: string | null;
  attendees: string[];          // Always an array, may be empty
  durationDays: number | null;
  durationHours: number | null;
  pinnedTop: boolean;
}
