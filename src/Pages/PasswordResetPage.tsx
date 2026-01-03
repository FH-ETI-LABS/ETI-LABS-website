import { useState } from "react";
import "./CreateAccountPage.css";
import { supabase } from "../lib/supabase";

type PasswordResetPageProps = {
  onNavigate: (page: string) => void;
};

const PasswordResetPage = ({ onNavigate }: PasswordResetPageProps) => {
  const [darkMode, setDarkMode] = useState(false);

  // flow control
  const [step, setStep] = useState<"email" | "new-password">("email");

  // form state
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     STEP 1: SEND RESET EMAIL
     ========================= */
  const sendResetEmail = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
    } else {
      setStep("new-password");
    }

    setLoading(false);
  };

  /* =========================
     STEP 2: UPDATE PASSWORD
     ========================= */
  const updatePassword = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      onNavigate("login");
    }

    setLoading(false);
  };

  return (
    <div className={`create-page ${darkMode ? "dark-mode" : ""}`}>
      {/* TOP RIGHT ICONS */}
      <div className="create-icons">
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button className="icon-btn" onClick={() => onNavigate("login")}>
          ←
        </button>
      </div>

      <div className="create-container">
        <h1 className="create-title">Emerging Technologies Institute</h1>

        <div className="create-card">
          <h2>Reset Password</h2>

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <>
              <input
                className="form-input"
                placeholder="Account Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                className="login-button"
                onClick={sendResetEmail}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </>
          )}

          {/* STEP 2: NEW PASSWORD */}
          {step === "new-password" && (
            <>
              <input
                className="form-input"
                type="password"
                placeholder="New Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                className="login-button"
                onClick={updatePassword}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save New Password"}
              </button>
            </>
          )}

          {error && (
            <p style={{ color: "red", marginTop: "12px" }}>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
