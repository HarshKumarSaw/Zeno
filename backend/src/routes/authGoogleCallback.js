// src/routes/authGoogleCallback.js
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("No code provided", { status: 400 });

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const body = new URLSearchParams({
    code,
    client_id: context.env.GOOGLE_CLIENT_ID,
    client_secret: context.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "https://zeno-backend.harshsaw01.workers.dev/api/auth/google/callback",  // ✅ Fixed
    grant_type: "authorization_code",
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    // Optional: Redirect to frontend with error
    return Response.redirect("https://zeno-frontend-ten.vercel.app/?auth=fail", 302);
  }

  const { access_token, refresh_token, expires_in } = tokenData;
  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  // Store in Neon (replace 1 with a real user/session id in real apps)
  await context.env.DB.prepare(
    `INSERT INTO sessions(user_id, google_access_token, google_refresh_token, google_token_expires, created_at) 
     VALUES(?, ?, ?, ?, NOW())`
  ).bind(1, access_token, refresh_token, expiresAt).run();

  // ✅ Redirect user back to frontend with success
  return Response.redirect("https://zeno-frontend-ten.vercel.app/?auth=success", 302);
}
