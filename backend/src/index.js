import * as authGoogle from './routes/authGoogle.js';
import * as authGoogleCallback from './routes/authGoogleCallback.js';
import * as timelineEvents from './routes/timelineEvents.js'; // ✅ Timeline API
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

    // ✅ Timeline event fetch endpoint
    if (path === '/api/timelineEvents') {
      return timelineEvents.onRequestGet({ request, env, waitUntil: ctx.waitUntil });
    }

    // ❌ Fallback handler for unmatched routes
    return new Response('Not Found', { status: 404 });
  }
};
