import postgres from "postgres";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  // 🎯 1. Exchange code for access token
  const tokenUrl = "https://oauth2.googleapis.com/token";

  const tokenBody = new URLSearchParams({
    code,
    client_id: context.env.GOOGLE_CLIENT_ID,
    client_secret: context.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "https://zeno-backend.harshsaw01.workers.dev/api/auth/google/callback",
    grant_type: "authorization_code",
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenBody,
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return Response.redirect("https://zeno-frontend-ten.vercel.app/?auth=fail", 302);
  }

  const { access_token, refresh_token, expires_in } = tokenData;
  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  // 📥 2. Fetch Google user profile
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!profileRes.ok) {
    return Response.redirect("https://zeno-frontend-ten.vercel.app/?auth=fail", 302);
  }

  const profile = await profileRes.json();
  const userEmail = profile.email;

  // 🗃️ 3. Connect to database
  const sql = postgres(context.env.DATABASE_URL, { ssl: "prefer" });

  try {
    // 🔍 4. Find or create user based on email
    let userResult = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
    let userId;

    if (userResult.length === 0) {
      const insertedUser = await sql`
        INSERT INTO users (email, created_at)
        VALUES (${userEmail}, NOW())
        RETURNING id
      `;
      userId = insertedUser[0].id;
    } else {
      userId = userResult[0].id;
    }

    // 🧹 Step 1: Delete any existing sessions for this user
    await sql`
      DELETE FROM sessions WHERE user_id = ${userId}
    `;

    // 🧾 5. Insert session using real user ID
    await sql`
      INSERT INTO sessions (
        user_id, google_access_token, google_refresh_token, google_token_expires, created_at
      ) VALUES (
        ${userId}, ${access_token}, ${refresh_token}, ${expiresAt}, NOW()
      )
    `;

    return Response.redirect("https://zeno-frontend-ten.vercel.app/?auth=success", 302);
  } catch (err) {
    console.error("DB Error:", err);
    return Response.redirect("https://zeno-frontend-ten.vercel.app/?auth=fail", 302);
  } finally {
    if (sql.end) await sql.end();
  }
}
