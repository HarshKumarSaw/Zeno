export async function onRequest() {
  return new Response("Hello from Zeno Backend!", { status: 200 });
}
