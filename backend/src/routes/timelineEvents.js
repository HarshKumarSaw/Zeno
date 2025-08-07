import { getValidAccessToken } from "../utils/refreshGoogleToken.js";

// Returns UTC ISO strings for full IST day
function getISTDayRange(dateStr) {
  const timeMin = new Date(`${dateStr}T00:00:00+05:30`).toISOString();
  const timeMax = new Date(`${dateStr}T23:59:59.999+05:30`).toISOString();
  return { timeMin, timeMax };
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const userId = url.searchParams.get("user");
  const date = url.searchParams.get("date");

  if (!userId || !date) {
    return new Response(JSON.stringify({ error: "Missing user or date param" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const token = await getValidAccessToken(context, userId);
    const { timeMin, timeMax } = getISTDayRange(date);

    const apiUrl = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    apiUrl.searchParams.set("timeMin", timeMin);
    apiUrl.searchParams.set("timeMax", timeMax);
    apiUrl.searchParams.set("singleEvents", "true");
    apiUrl.searchParams.set("orderBy", "startTime");

    const eventsRes = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!eventsRes.ok) {
      const errorText = await eventsRes.text();
      throw new Error(`Google Calendar API error: ${errorText}`);
    }

    const data = await eventsRes.json();

    const events = (data.items || []).map(ev => {
      const isAllDay = !!ev.start.date;
      const start = isAllDay ? ev.start.date : ev.start.dateTime;
      const end = isAllDay ? ev.end.date : ev.end.dateTime;

      const durationDays = isAllDay
        ? (new Date(ev.end.date) - new Date(ev.start.date)) / (1000 * 60 * 60 * 24)
        : null;

      return {
        id: ev.id,
        recurringEventId: ev.recurringEventId || null,
        title: ev.summary || "Untitled Event",
        start,
        end,
        startUtc: isAllDay ? null : new Date(ev.start.dateTime).toISOString(),
        endUtc: isAllDay ? null : new Date(ev.end.dateTime).toISOString(),
        allDay: isAllDay,
        colorId: ev.colorId || null,
        location: ev.location || null,
        timeZone: isAllDay ? null : ev.start.timeZone || data.timeZone || null,
        endExclusive: isAllDay ? ev.end.date : undefined,
        attendees: (ev.attendees || []).map(a => a.email),
        durationDays,
        pinnedTop: isAllDay // ✅ new: lets the frontend "pin" all-day events
      };
    });

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Fetch events error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch events" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
