export default {
  async fetch(request) {
    return new Response("Hello from Zeno Backend 🚀", {
      headers: { "content-type": "text/plain" },
    });
  },
};
