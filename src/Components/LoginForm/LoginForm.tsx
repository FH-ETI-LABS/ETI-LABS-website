import "./LoginForm.css";
import logo from "../../assets/images/ETILOGO.png";
import { useState } from "react";

//Login Form
const LoginForm = () => {
  //use state for if nextbutton is clicked and what is in the username field
  const [nextClicked, setNextClicked] = useState(false);
  const [usernameText, usernameSetText] = useState("");

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo / Header */}
        <div className="login-header">
          <img src={logo} />
        </div>

        {/* Title */}
        <h2 className="login-title">Sign in</h2>

        {/* Username Field: tracks text entered */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="form-input"
            onChange={(e) => usernameSetText(e.target.value)}
          />
        </div>

        {/*Password Field*/}

        {nextClicked && (
          <div className="form-group">
            <label htmlFor="Password" className="form-label">
              Password
            </label>
            <input id="password" type="text" className="form-input" />
          </div>
        )}

        {/* Next Button/show password field */}
        <button
          className="login-button"
          onClick={() => {
            if (usernameText == "Admin") {
              setNextClicked(true);
            }
          }}
        >
          NEXT
        </button>

        {/* Links */}
        <div className="login-links">
          <a href="#" className="help-link">
            Need help signing in?
          </a>
          <div className="signup-text">
            New to ETI?{" "}
            <a href="#" className="signup-link">
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
