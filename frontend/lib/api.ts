// /lib/api.ts
export async function fetchTimelineEvents(userId: string, date: string) {
  const url = new URL('https://zeno-backend.harshsaw01.workers.dev/api/timelineEvents');
  url.searchParams.set('user', userId);
  url.searchParams.set('date', date);

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }

  return res.json();
}
