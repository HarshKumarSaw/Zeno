const allowedOrigin = process.env.ALLOWED_ORIGIN; // "*" for dev, env var for prod

export function withCorsHeaders(resp) {
  resp.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  resp.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return resp;
}
