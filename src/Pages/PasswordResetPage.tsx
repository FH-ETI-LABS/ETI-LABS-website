import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./CreateAccountPage.css";

type PasswordResetPageProps = {
  onNavigate: (page: string) => void;
};

const PasswordResetPage = ({ onNavigate }: PasswordResetPageProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const handleSendReset = async () => {
    setLoading(true);
    setMessage(null);

    // Prefer an explicit site URL from env during development so the emailed
    // link points to a reachable host/port. Falls back to window.location.origin.
    const redirectBase = import.meta.env.VITE_APP_URL || window.location.origin;
    const redirectTo = redirectBase + "/reset-password";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

  setSent(true);
  setMessage("Check your email for a password reset link.");
    setLoading(false);
    setCooldown(30);
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div className={`create-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="create-icons">
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button className="icon-btn" onClick={() => onNavigate("login")}>
          ←
        </button>
      </div>

      <div className="create-container">
        
        <h1 className="create-title">Reset Password</h1>

        <div className="create-card">
          {!sent ? (
            <>
              <label>Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@foothill.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {message && <p>{message}</p>}

              <button
                className="login-button"
                onClick={handleSendReset}
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </>
          ) : (
            <div style={{ padding: 12 }}>
              <h3 style={{ color: "green" }}>Reset email sent</h3>
              <p>Check your email for a password reset link. It may take a minute to arrive.</p>
              <p style={{ fontSize: 12, color: "#666" }}>
                The link will open: <strong>{import.meta.env.VITE_APP_URL || window.location.origin}/reset-password</strong>
              </p>
              <div style={{ marginTop: 8 }}>
                {cooldown > 0 ? (
                  <span>Resend available in {cooldown}s</span>
                ) : (
                  <button
                    onClick={() => {
                      setSent(false);
                      setMessage(null);
                    }}
                  >
                    Resend
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
