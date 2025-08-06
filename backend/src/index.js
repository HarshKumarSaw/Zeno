import * as authGoogle from './routes/authGoogle.js';
import * as authGoogleCallback from './routes/authGoogleCallback.js';
import * as events from './routes/timelineEvents.js'; // ✅ Added
import { getValidAccessToken } from './utils/refreshGoogleToken.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ✅ Google OAuth endpoints
    if (path === '/api/auth/google') {
      return authGoogle.onRequestGet({ request, env, waitUntil: ctx.waitUntil });
    }

    if (path === '/api/auth/google/callback') {
      return authGoogleCallback.onRequestGet({ request, env, waitUntil: ctx.waitUntil });
    }

    // ✅ Event fetch endpoint
    if (path === '/api/timelineEvents') {
      return timelineEvents.onRequestGet({ request, env, waitUntil: ctx.waitUntil });
    }

    // ✅ Optional: Token testing route (you mentioned deleting later)
    if (path === '/api/testToken') {
      const userId = url.searchParams.get('user');

      if (!userId) {
        return new Response(JSON.stringify({ error: 'Missing user query param' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        const token = await getValidAccessToken({ env }, userId);
        return new Response(JSON.stringify({ token }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.error('Token refresh failed:', err);
        return new Response(JSON.stringify({ error: 'Failed to get access token' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // ❌ Fallback handler for unmatched routes
    return new Response('Not Found', { status: 404 });
  }
};
