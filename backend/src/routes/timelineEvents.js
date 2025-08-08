import { getValidAccessToken } from "../utils/refreshGoogleToken.js";
import { withCorsHeaders } from "../utils/cors.js";

function getISTDayRange(dateStr) {
  const timeMin = new Date(`${dateStr}T00:00:00+05:30`).toISOString();
  const timeMax = new Date(`${dateStr}T23:59:59.999+05:30`).toISOString();
  return { timeMin, timeMax };
}

export async function onRequestGet(context) {
  const { env } = context;
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";

  const url = new URL(context.request.url);
  const userId = url.searchParams.get("user");
  const date = url.searchParams.get("date");

  if (!userId || !date) {
    return withCorsHeaders(
      new Response(JSON.stringify({ error: "Missing user or date param" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }),
      allowedOrigin
    );
  }

  try {
    const token = await getValidAccessToken(context, userId);
    const { timeMin, timeMax } = getISTDayRange(date);

    const apiUrl = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    apiUrl.searchParams.set("timeMin", timeMin);
    apiUrl.searchParams.set("timeMax", timeMax);
    apiUrl.searchParams.set("singleEvents", "true");
    apiUrl.searchParams.set("orderBy", "startTime");
    apiUrl.searchParams.set(
      "fields",
      "items(id,recurringEventId,summary,start,end,colorId,location,attendees,recurrence),timeZone"
    );

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
      const durationHours = !isAllDay
        ? (new Date(end) - new Date(start)) / (1000 * 60 * 60)
        : null;
      return {
        id: ev.id,
        recurringEventId: ev.recurringEventId || null,
        title: ev.summary || "Untitled Event",
        start,
        end,
        startUtc: isAllDay ? null : new Date(ev.start.dateTime).toISOString(),
        endUtc: isAllDay ? null : new Date(ev.end.dateTime).toISOString(),
        startIso: isAllDay ? new Date(ev.start.date).toISOString() : null,
        endIso: isAllDay ? new Date(ev.end.date).toISOString() : null,
        allDay: isAllDay,
        colorId: ev.colorId || null,
        location: ev.location || null,
        timeZone: isAllDay ? null : ev.start.timeZone || data.timeZone || null,
        endExclusive: isAllDay ? ev.end.date : undefined,
        attendees: (ev.attendees || []).map(a => a.email),
        durationDays,
        durationHours,
        pinnedTop: isAllDay
      };
    });

    return withCorsHeaders(
      new Response(JSON.stringify(events), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }),
      allowedOrigin
    );

  } catch (err) {
    console.error("Fetch events error", { userId, date, err });
    return withCorsHeaders(
      new Response(JSON.stringify({ error: "Failed to fetch events" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }),
      allowedOrigin
    );
  }
}

// CORS preflight (OPTIONS) handler
export async function onRequestOptions(context) {
  const allowedOrigin = context.env.ALLOWED_ORIGIN || "*";
  return withCorsHeaders(new Response(null, { status: 204 }), allowedOrigin);
}
