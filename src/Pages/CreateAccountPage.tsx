import { useState } from "react";
import "./CreateAccountPage.css";

type CreateAccountPageProps = {
  onNavigate: (page: string) => void;
};

const CreateAccountPage = ({ onNavigate }: CreateAccountPageProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`create-page ${darkMode ? "dark-mode" : ""}`}>
      {/* Top-right icons */}
      <div className="create-icons">
        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button className="icon-btn">?</button>
      </div>

      <div className="create-container">
        <h1 className="create-title">Emerging Technologies Institute</h1>

        <div className="create-card">
          <h2>Reset Password</h2>

          <div className="form-group">
            <label>Account Email:</label>
            <input className="form-input" placeholder="Email..." />
          </div>

          <div className="form-group">
            <label>Reset Code:</label>
            <input className="form-input" placeholder="12345..." />
          </div>

          <div className="form-group">
            <label>New Password:</label>
            <input
              className="form-input"
              type="password"
              placeholder="Password..."
            />
          </div>

          <div className="divider" />

          <button
            className="login-button"
            onClick={() => onNavigate("auth")}
          >
            Back to Login
          </button>

          <div className="divider" />

          <div className="help-section">
            <em>Still having trouble?</em>
            <div className="contact">
              <strong>Contact Us</strong>
              <div>Email us at eti@fhda.edu</div>
              <div>Call 650.949.7236</div>
              <div>Visit the STEM Division Office 4118</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
