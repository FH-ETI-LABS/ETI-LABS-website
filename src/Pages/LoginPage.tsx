import { useState } from "react";
import LoginForm from "../Components/LoginForm/LoginForm";
import "./LoginPage.css";

type LoginPageProps = {
  onNavigate: (page: string) => void;
};

const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className={`login-page ${darkMode ? "dark-mode" : ""}`}>
      {/* Top-right icons */}
      <div className="login-icons">
        <button
          className="icon-btn"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button className="icon-btn" onClick={() => setShowHelp(true)}>
          ?
        </button>
      </div>

      {/* Main content */}
      <div className="login-container-main">
        {showHelp && (
          <div className="login-help-backdrop" onClick={() => setShowHelp(false)}>
            <div
              className="login-help-modal"
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="login-help-header">
                <h3>Need help?</h3>
                <button
                  type="button"
                  className="login-help-close"
                  onClick={() => setShowHelp(false)}
                  aria-label="Close help"
                >
                  ×
                </button>
              </div>
              <div className="login-help-body">
                <p>For access or sign-in issues, contact the ETI team.</p>
                <div className="login-help-actions">
                  <a href="mailto:eti@fhda.edu">Email ETI Support</a>
                  <a href="https://foothill.edu/eti/" target="_blank" rel="noreferrer">
                    Visit ETI Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        <h1 className="login-title">Emerging Technologies Institute</h1>

        <div className="login-content">
          <div className="login-left">
            <LoginForm onNavigate={onNavigate} />
          </div>

          <div className="login-right">
            <h2>About ETI</h2>
            <p>
              <strong>Website:</strong>{" "}
              <a href="https://foothill.edu/eti/" target="_blank">
                https://foothill.edu/eti/
              </a>
            </p>

            <h3>Scope</h3>
            <ul>
              <li>Explore emerging technologies</li>
              <li>Identify technologies with educational impact</li>
              <li>Train and test technologies in labs</li>
              <li>Make recommendations for Foothill College</li>
              <li>Support campus-wide training</li>
            </ul>

            <h3>Technologies & Labs</h3>
            <p>
              Virtual Reality (VR), Artificial Intelligence (AI), Cymatics,
              Renewable Energy, Blockchain, Quantum Computing, Space Sciences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
