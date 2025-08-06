// src/routes/authGoogle.js

export async function onRequestGet(context) {
  const clientId = context.env.GOOGLE_CLIENT_ID;
  const redirectUri = "https://zeno-backend.harshsaw01.workers.dev/api/auth/google/callback";

  // ✅ Updated scope to fetch user's email + calendar access
  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/calendar.readonly",
  ].join(" ");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("access_type", "offline");     // for refresh token
  authUrl.searchParams.set("prompt", "consent");           // always ask user

  return Response.redirect(authUrl.toString(), 302);
}
