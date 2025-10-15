/**
 * HomePage Component
 * ------------------
 * The main landing page for Foothill ETI Labs.
 * Displays a grid of FeatureCard components that link to major site sections:
 */

import { useState } from "react";
import FeatureCard from "../Components/FeatureCard/FeatureCard";
import "./HomePage.css";
import LoginForm from "../Components/LoginForm/LoginForm";
import logo from "../assets/images/ETILOGO.png";
/**
 * The HomePage component provides the main navigation grid for the website.
 * Each card in the grid corresponds to a major lab function or information page.
 */

function HomePage() {
  const [loginStatus, setLoginStatus] = useState(false);

  // Titles for each navigation section

  const pages = [
    { title: "Lab Status", acronym: "LSU" },
    { title: "Lab Cameras", acronym: "LC" },
    { title: "Lab Staff", acronym: "LSF" },
    { title: "Lab Projects", acronym: "LP" },
    { title: "STEM Clubs", acronym: "SC" },
    { title: "Lab Equipment", acronym: "LE" },
    { title: "Lab Signups", acronym: "LSP" },
  ];

  if (loginStatus == true) {
    return (
      <div className="home-container">
        {/* Header containing Foothill ETI Labs logo */}
        <header className="home-header">
          <img src={logo} alt="Foothill ETI Labs Logo" className="lab-logo" />
        </header>

        {/* Main content area with welcome text and navigation grid */}
        <main className="home-content">
          <h1 className="home-title">Welcome to Foothill ETI Labs</h1>

          <div className="button-grid">
            {pages.map((page) => (
              <FeatureCard title={page.title} key={page.acronym} />
            ))}
          </div>
        </main>
      </div>
    );
  } else {
    return (
      <LoginForm loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
    );
  }
}

export default HomePage;
