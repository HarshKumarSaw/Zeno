// /src/utils/cors.js

// resp: a Response object
// allowedOrigin: e.g., env.ALLOWED_ORIGIN or "*"
export function withCorsHeaders(resp, allowedOrigin) {
  resp.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  resp.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return resp;
}
