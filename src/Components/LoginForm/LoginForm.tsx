import { useState } from "react";
import "./LoginForm.css";
import { supabase } from "../../lib/supabase";

type LoginFormProps = {
  onNavigate: (page: string) => void;
};

const LoginForm = ({ onNavigate }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [errorMsg, setErrorMsg] = useState("");
const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login clicked", { email, password });
  };

  const handleLogin = async () => {
  setErrorMsg("");
  setLoading(true);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setLoading(false);

  if (error) {
    setErrorMsg(error.message);
    return;
  }

  // ✅ SUCCESS → go to dashboard
  onNavigate("dashboard");
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-logo">Sign In</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
  className="form-input"
  placeholder="Email..."
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
          </div>

          <div className="form-group">
            <input
            className="form-input"
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>

          {/* Password reset */}
          <button
            type="button"
            className="help-link"
            onClick={() => onNavigate("password-reset")}
          >
            Need help signing in?
          </button>

          <button
  className="login-button"
  onClick={handleLogin}
  disabled={loading}
>
  {loading ? "Signing in..." : "NEXT"}
</button>
        </form>

        <div className="divider" />

        <div className="login-links">
          <div className="section-title">New to ETI?</div>
          <button
            type="button"
            className="help-link"
            onClick={() => onNavigate("create-account")}
          >
            Create Account
          </button>
        </div>

        <div className="divider" />

        <div className="login-links">
          <div className="section-title">Contact Us</div>
          <div>Email us at eti@fhda.edu</div>
          <div>Call 650.949.7236</div>
          <div>Visit the STEM Division Office 4118</div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
