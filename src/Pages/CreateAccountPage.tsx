import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./CreateAccountPage.css";

type CreateAccountPageProps = {
  onNavigate: (page: string) => void;
};

const CreateAccountPage = ({ onNavigate }: CreateAccountPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [darkMode, setDarkMode] = useState(false);

  const handleCreateAccount = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Supabase may require email confirmation
      alert("Check your email to confirm your account.");
      onNavigate("login");
    }
  };

  return (
<div className={`create-page ${darkMode ? "dark-mode" : ""}`}>
     <div className="create-icons">
  <button
    className="icon-btn"
    onClick={() => setDarkMode((prev) => !prev)}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

  <button
    className="icon-btn"
    onClick={() => onNavigate("login")}
  >
    ?
  </button>
</div>

     
      <div className="create-container">
        <h1 className="create-title">Create Account</h1>

        <div className="create-card">
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            className="login-button"
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <div className="divider" />

          <button
            className="help-link"
            onClick={() => onNavigate("login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
