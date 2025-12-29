import { useState } from "react";
import LoginForm from "../Components/LoginForm/LoginForm";
import "./LoginPage.css";

type LoginPageProps = {
  onNavigate: (page: string) => void;
};

const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const [darkMode, setDarkMode] = useState(false);

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
        <button className="icon-btn">?</button>
      </div>

      {/* Main content */}
      <div className="login-container-main">
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
