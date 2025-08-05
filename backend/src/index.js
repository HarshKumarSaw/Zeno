import postgres from "postgres";

export default {
  async fetch(request, env) {
    try {
      const sql = postgres(env.DATABASE_URL, { ssl: 'require' });

      // Query to get table names
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema='public';
      `;

      await sql.end();

      return new Response(
        `Tables in DB: ${tables.map(t => t.table_name).join(', ')}`,
        { headers: { "content-type": "text/plain" } }
      );
    } catch (err) {
      return new Response("DB Connection Error: " + err.message, { status: 500 });
    }
  },
};
