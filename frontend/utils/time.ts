// /utils/time.ts

export function getDurationInMinutes(start: string, end: string): number {
  return (new Date(end).getTime() - new Date(start).getTime()) / 60000;
}

export function getHourFromISO(iso: string): number {
  return new Date(iso).getHours();
}
