// src/routes/events.js

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
    // Step 1: Get valid access token for this user
    const token = await getValidAccessToken(context, userId);

    // Step 2: Compute UTC start/end time of the given day
    const dayStart = new Date(`${date}T00:00:00.000Z`).toISOString();
    const dayEnd = new Date(`${date}T23:59:59.999Z`).toISOString();

    // Step 3: Build Google Calendar API request
    const apiUrl = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    apiUrl.searchParams.set("timeMin", dayStart);
    apiUrl.searchParams.set("timeMax", dayEnd);
    apiUrl.searchParams.set("singleEvents", "true");
    apiUrl.searchParams.set("orderBy", "startTime");

    const eventsRes = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!eventsRes.ok) {
      const errText = await eventsRes.text();
      throw new Error(`Google Calendar API error: ${errText}`);
    }

    const apiData = await eventsRes.json();

    // Step 4: Normalize the response for frontend use
    const events = (apiData.items || []).map(ev => ({
      id: ev.id,
      title: ev.summary || "Untitled Event",
      start: ev.start.dateTime || ev.start.date, // Handles all-day
      end: ev.end.dateTime || ev.end.date,       // Handles all-day
      colorId: ev.colorId || null,
      allDay: !!ev.start.date, // If only `date` exists → all-day
      location: ev.location || null,
      attendees: (ev.attendees || []).map(person => person.email)
    }));

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
