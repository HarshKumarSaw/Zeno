import postgres from "postgres";

export async function getValidAccessToken(context, userId) {
  const sql = postgres(context.env.DATABASE_URL, { ssl: "prefer" });

  // 1️⃣ Get latest session for user
  const [session] = await sql`
    SELECT *
    FROM sessions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (!session) throw new Error("No session found for user");

  const now = new Date();
  const expiresAt = new Date(session.google_token_expires);

  // 2️⃣ If token still valid, return it
  if (expiresAt > now) {
    if (sql.end) await sql.end();
    return session.google_access_token;
  }

  // 3️⃣ Refresh token
  const tokenUrl = "https://oauth2.googleapis.com/token";
  const body = new URLSearchParams({
    client_id: context.env.GOOGLE_CLIENT_ID,
    client_secret: context.env.GOOGLE_CLIENT_SECRET,
    refresh_token: session.google_refresh_token,
    grant_type: "refresh_token",
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) throw new Error("Failed to refresh token");

  const newAccessToken = tokenData.access_token;
  const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

  // 4️⃣ Update DB with new token
  await sql`
    UPDATE sessions
    SET google_access_token = ${newAccessToken},
        google_token_expires = ${newExpiresAt}
    WHERE id = ${session.id}
  `;

  if (sql.end) await sql.end();

  return newAccessToken;
}
