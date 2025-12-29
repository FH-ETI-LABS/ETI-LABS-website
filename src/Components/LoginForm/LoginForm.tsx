import { useState } from "react";
import "./LoginForm.css";

type LoginFormProps = {
  onNavigate: (page: string) => void;
};

const LoginForm = ({ onNavigate }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login clicked", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-logo">Sign In</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              placeholder="Username..."
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

          <button className="login-button" type="submit">
            NEXT
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
