import postgres from "postgres"; // At the top of your file

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("No code provided", { status: 400 });

  // ...existing token exchange logic...

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const body = new URLSearchParams({
    code,
    client_id: context.env.GOOGLE_CLIENT_ID,
    client_secret: context.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "https://zeno-backend.harshsaw01.workers.dev/api/auth/google/callback",
    grant_type: "authorization_code",
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    return Response.redirect("https://zeno-frontend-ten.vercel.app/?auth=fail", 302);
  }

  // Connect to Neon using postgres.js and DATABASE_URL
  const sql = postgres(context.env.DATABASE_URL, { ssl: 'prefer' });

  const { access_token, refresh_token, expires_in } = tokenData;
  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  // Replace 1 with the real user/session if needed
  await sql`
    INSERT INTO sessions (user_id, google_access_token, google_refresh_token, google_token_expires, created_at)
    VALUES (1, ${access_token}, ${refresh_token}, ${expiresAt}, NOW())
  `;

  // Optionally close the connection (not always needed in serverless)
  if (sql.end) await sql.end();

  return Response.redirect("https://zeno-frontend-ten.vercel.app/?auth=success", 302);
}
