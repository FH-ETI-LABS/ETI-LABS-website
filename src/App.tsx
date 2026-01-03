import { useState } from "react";

import LandingPage from "./Pages/landingpage";
import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import PasswordResetPage from "./Pages/PasswordResetPage";
import DashboardPage from "./Pages/DashboardPage";

/* =====================
   PAGE TYPES
===================== */

type Page =
  | "landing"
  | "login"
  | "create-account"
  | "password-reset"
  | "dashboard";

function App() {
  // 🌍 App-level navigation state
  const [currentPage, setCurrentPage] = useState<Page>("landing");

  /* =====================
     DASHBOARD (FULL SCREEN)
     ===================== */
  if (currentPage === "dashboard") {
    return <DashboardPage onNavigate={setCurrentPage} />;
  }

  /* =====================
     PUBLIC PAGES
     ===================== */
  switch (currentPage) {
    case "landing":
      return <LandingPage onNavigate={setCurrentPage} />;

    case "login":
      return <LoginPage onNavigate={setCurrentPage} />;

    case "create-account":
      return <CreateAccountPage onNavigate={setCurrentPage} />;

    case "password-reset":
      return <PasswordResetPage onNavigate={setCurrentPage} />;

    default:
      return <LandingPage onNavigate={setCurrentPage} />;
  }
}

export default App;
