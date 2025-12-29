import { useState } from "react";
import "./LoginForm.css";

const LoginForm = () => {
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

        <a
          href="#"
          className="help-link"
          onClick={(e) => {
            e.preventDefault();
            alert("Contact ETI at eti@fhda.edu");
          }}
        >
          Need help signing in?
        </a>

        <button className="login-button" type="submit">
          NEXT
        </button>
      </form>

      <div className="divider" />

      <div className="login-links">
        <div className="section-title">New to ETI?</div>
        <a
          href="#"
          className="help-link"
          onClick={(e) => {
            e.preventDefault();
            alert("Create Account coming soon");
          }}
        >
          Create Account
        </a>
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
}


export default LoginForm;
