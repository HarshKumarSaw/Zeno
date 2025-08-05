export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/ping") {
      return new Response(
        JSON.stringify({ status: "ok", message: "pong" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("Hello from Zeno Worker Backend!", { status: 200 });
  }
};
