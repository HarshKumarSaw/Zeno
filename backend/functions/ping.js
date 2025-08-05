export async function onRequest() {
  return new Response(
    JSON.stringify({ status: "ok", message: "pong" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
