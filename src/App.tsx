import { useState } from "react";

import LandingPage from "./Pages/landingpage";
import LoginPage from "./Pages/LoginPage";
import DashboardPage from "./Pages/DashboardPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import PasswordResetPage from "./Pages/PasswordResetPage";

function App() {
  // ✅ Landing page is the true entry point
  const [currentPage, setCurrentPage] = useState("landing");

  switch (currentPage) {
    case "landing":
      return <LandingPage onNavigate={setCurrentPage} />;

    case "login":
      return <LoginPage onNavigate={setCurrentPage} />;

    case "create-account":
      return <CreateAccountPage onNavigate={setCurrentPage} />;

    case "password-reset":
      return <PasswordResetPage onNavigate={setCurrentPage} />;

    case "dashboard":
      return <DashboardPage onNavigate={setCurrentPage} />;

    default:
      return <LandingPage onNavigate={setCurrentPage} />;
  }
}

export default App;
