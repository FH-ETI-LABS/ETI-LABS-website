import { useState } from "react";

import LoginPage from "./Pages/LoginPage";
import DashboardPage from "./Pages/DashboardPage";

import CreateAccountPage from "./Pages/CreateAccountPage";
import PasswordResetPage from "./Pages/PasswordResetPage";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard"); 
  // 👆 start on dashboard for dev (change back later)

  switch (currentPage) {
    case "dashboard":
      return <DashboardPage onNavigate={setCurrentPage} />;
    case "create-account":
      return <CreateAccountPage onNavigate={setCurrentPage} />;

    case "password-reset":
      return <PasswordResetPage onNavigate={setCurrentPage} />;
    default:
      return <LoginPage onNavigate={setCurrentPage} />;
  }
}

export default App;