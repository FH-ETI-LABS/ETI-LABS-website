import { useState } from "react";
import "./CreateAccountPage.css"; // reuse existing styles

type PasswordResetPageProps = {
  onNavigate: (page: string) => void;
};

const PasswordResetPage = ({ onNavigate }: PasswordResetPageProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`create-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="create-icons">
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button className="icon-btn" onClick={() => onNavigate("auth")}>
          ←
        </button>
      </div>

      <div className="create-container">
        <h1 className="create-title">Emerging Technologies Institute</h1>

        <div className="create-card">
          <h2>Reset Password</h2>

          <input className="form-input" placeholder="Account Email..." />
          <input className="form-input" placeholder="Reset Code..." />
          <input
            className="form-input"
            type="password"
            placeholder="New Password..."
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
