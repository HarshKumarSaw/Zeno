import postgres from "postgres";

export default {
  async fetch(request, env) {
    try {
      const sql = postgres(env.DATABASE_URL, { ssl: 'require' });
      const result = await sql`SELECT NOW()`;
      await sql.end();

      return new Response(
        `Hello from Zeno Backend 🚀\nDB Time: ${result[0].now}`,
        { headers: { "content-type": "text/plain" } }
      );
    } catch (err) {
      return new Response("DB Connection Error: " + err.message, { status: 500 });
    }
  },
};
