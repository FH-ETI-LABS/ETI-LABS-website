import { useState } from "react";
import DashboardPage from "./Pages/DashboardPage";
import StaffPage from "./Pages/StaffPage";
import ClubsPage from "./Pages/ClubsPage";
import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import PasswordResetPage from "./Pages/PasswordResetPage";


function App() {
  const [currentPage, setCurrentPage] = useState("auth");

  try {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentPage} />;

      case "staff":
        return <StaffPage onNavigate={setCurrentPage} />;

      case "clubs":
        return <ClubsPage onNavigate={setCurrentPage} />;

      case "create-account":
        return <CreateAccountPage onNavigate={setCurrentPage} />;
      case "password-reset":
        return <PasswordResetPage onNavigate={setCurrentPage} />;
      default:
        return <LoginPage onNavigate={setCurrentPage} />;
    }
  } catch (err) {
    console.error("App render error:", err);
    return <div style={{ padding: 40 }}>Something went wrong.</div>;
  }
}

export default App;
