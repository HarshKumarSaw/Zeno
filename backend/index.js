// backend/index.js
export default {
  async fetch(req, env, ctx) {
    return new Response("Hello from Zeno Backend!", { status: 200 });
  }
}
