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
  const [darkMode, setDarkMode] = useState(false);

  const handleSendReset = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a password reset link.");
    }

    setLoading(false);
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
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
