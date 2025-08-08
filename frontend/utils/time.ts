// /utils/time.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize plugins ONCE in your project/file (top level)
dayjs.extend(utc);
dayjs.extend(timezone);

export function getDurationInMinutes(start: string, end: string): number {
  return dayjs(end).diff(dayjs(start), "minute");
}

export function getHourFractionFromISO(iso: string, tz: string = "Asia/Kolkata") {
  const d = dayjs.tz(iso, tz);
  return d.hour() + d.minute() / 60;
}
