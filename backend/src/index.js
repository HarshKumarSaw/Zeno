import * as authGoogle from './routes/authGoogle.js';
import * as authGoogleCallback from './routes/authGoogleCallback.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/api/auth/google') {
      return authGoogle.onRequestGet({ request, env, waitUntil: ctx.waitUntil });
    }
    if (path === '/api/auth/google/callback') {
      return authGoogleCallback.onRequestGet({ request, env, waitUntil: ctx.waitUntil });
    }
    return new Response('Not Found', { status: 404 });
  }
};
