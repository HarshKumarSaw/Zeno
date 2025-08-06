import { useEffect, useState } from "react";

export default function Home() {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get("auth");
    if (authResult === "success") {
      setAuthStatus("success");
    } else if (authResult === "fail") {
      setAuthStatus("fail");
    }
  }, []);

  const handleGoogleSignIn = () => {
    const workerOAuthStartUrl = "https://zeno-backend.harshsaw01.workers.dev/api/auth/google";
    window.location.href = workerOAuthStartUrl;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Welcome to Zeno 🚀</h1>
      <p>Frontend deployed on Vercel successfully.</p>

      <button
        onClick={handleGoogleSignIn}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          backgroundColor: "#4285F4",
          color: "white",
          fontSize: "16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>

      {authStatus === "success" && (
        <p style={{ color: "green", marginTop: "20px" }}>
          ✅ Google login successful!
        </p>
      )}

      {authStatus === "fail" && (
        <p style={{ color: "red", marginTop: "20px" }}>
          ❌ Google login failed. Please try again.
        </p>
      )}
    </div>
  );
            }
