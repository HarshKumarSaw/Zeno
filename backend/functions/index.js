export async function onRequest(context) {
  return new Response("Hello from Zeno Backend!", { status: 200 });
}
