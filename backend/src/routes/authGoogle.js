// src/routes/authGoogle.js
export async function onRequestGet(context) {
  const clientId = context.env.GOOGLE_CLIENT_ID;
  const redirectUri = "https://zeno-frontend-ten.vercel.app/api/auth/google/callback";
  const scope = "https://www.googleapis.com/auth/calendar.readonly";

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  return Response.redirect(authUrl.toString(), 302);
}
