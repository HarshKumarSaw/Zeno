import { getValidAccessToken } from "../utils/refreshGoogleToken.js";

// 🔧 Local function to compute the UTC time window of the full IST calendar day
function getISTDayRange(dateStr) {
  // IST = UTC+5:30 → offset in milliseconds
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

  // Create Date in IST by forcing offset
  const istStart = new Date(`${dateStr}T00:00:00+05:30`);
  const istEnd = new Date(`${dateStr}T23:59:59.999+05:30`);

  // Convert to UTC by subtracting the IST offset
  const utcStart = new Date(istStart.getTime() - IST_OFFSET_MS).toISOString();
  const utcEnd = new Date(istEnd.getTime() - IST_OFFSET_MS).toISOString();

  return { timeMin: utcStart, timeMax: utcEnd };
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const userId = url.searchParams.get("user");
  const date = url.searchParams.get("date"); // Format: YYYY-MM-DD

  if (!userId || !date) {
    return new Response(JSON.stringify({ error: "Missing user or date param" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 1️⃣ Get valid token
    const token = await getValidAccessToken(context, userId);

    // 2️⃣ Get timeMin and timeMax based on IST calendar day
    const { timeMin, timeMax } = getISTDayRange(date);

    // 3️⃣ Build Google Calendar API URL
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
      throw new Error(`Google Calendar API Error: ${errorText}`);
    }

    const data = await eventsRes.json();

    // 4️⃣ Normalize events
    const events = (data.items || []).map(ev => {
      const isAllDay = !!ev.start.date;

      return {
        id: ev.id,
        title: ev.summary || "Untitled Event",
        start: isAllDay ? ev.start.date : ev.start.dateTime,
        end: isAllDay ? ev.end.date : ev.end.dateTime,
        allDay: isAllDay,
        colorId: ev.colorId || null,
        location: ev.location || null,
        attendees: (ev.attendees || []).map(a => a.email),
        timeZone: isAllDay
          ? null
          : ev.start.timeZone || data.timeZone || null
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
