export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    // Root endpoint
    if (url.pathname === "/") {
      return new Response("Hello from Zeno Backend!", { status: 200 });
    }

    // Ping endpoint
    if (url.pathname === "/ping") {
      return new Response(JSON.stringify({ status: "ok", message: "pong" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Fallback 404
    return new Response("Not Found", { status: 404 });
  }
}
