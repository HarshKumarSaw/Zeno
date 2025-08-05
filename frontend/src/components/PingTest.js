// src/components/PingTest.js
import React, { useState } from "react";

export default function PingTest() {
  const [response, setResponse] = useState(null);

  const handlePing = async () => {
    try {
      const res = await fetch(
        "https://zeno-backend.harshsaw01.workers.dev/ping"
      );
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Zeno Backend Ping Test</h2>
      <button
        onClick={handlePing}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        Ping Backend
      </button>
      {response && (
        <pre style={{ marginTop: "1rem", textAlign: "left" }}>{response}</pre>
      )}
    </div>
  );
}
