document.getElementById("pingButton").addEventListener("click", async () => {
  const pingResult = document.getElementById("pingResult");
  pingResult.textContent = "Pinging backend...";

  // Change this later to your Render backend URL
  const backendUrl = "https://example-backend.onrender.com/ping";

  try {
    const response = await fetch(backendUrl);
    const text = await response.text();
    pingResult.textContent = `Backend says: ${text}`;
  } catch (err) {
    pingResult.textContent = "Could not reach backend yet!";
  }
});
