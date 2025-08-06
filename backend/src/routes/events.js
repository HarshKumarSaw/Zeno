import { getValidAccessToken } from "../utils/refreshGoogleToken.js";

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
    // 1️⃣ Get valid Google access token for this user
    const token = await getValidAccessToken(context, userId);

    // 2️⃣ Compute the UTC range for that day
    const startOfDay = new Date(`${date}T00:00:00.000Z`).toISOString();
    const endOfDay = new Date(`${date}T23:59:59.999Z`).toISOString();

    // 3️⃣ Fetch events from Google Calendar
    const apiURL = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    apiURL.searchParams.set("timeMin", startOfDay);
    apiURL.searchParams.set("timeMax", endOfDay);
    apiURL.searchParams.set("singleEvents", "true");
    apiURL.searchParams.set("orderBy", "startTime");

    const response = await fetch(apiURL.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Calendar API Error: ${errText}`);
    }

    const data = await response.json();

    // 4️⃣ Normalize each event
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

        // Optional: include time zone info for frontend
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
