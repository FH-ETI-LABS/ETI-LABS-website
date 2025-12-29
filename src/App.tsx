import { useState } from "react";
import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import PasswordResetPage from "./Pages/PasswordResetPage";
import ProjectsPage from "./Pages/ProjectsPage";
import DashboardPage from "./Pages/DashboardPage";

function App() {
  const [currentPage, setCurrentPage] = useState("projects");

  switch (currentPage) {
    case "dashboard":
      return <DashboardPage onNavigate={setCurrentPage} />;

    case "projects":
      return <ProjectsPage onNavigate={setCurrentPage} />;

    case "create-account":
      return <CreateAccountPage onNavigate={setCurrentPage} />;

    case "password-reset":
      return <PasswordResetPage onNavigate={setCurrentPage} />;

    default:
      return <LoginPage onNavigate={setCurrentPage} />;
  }
}

export default App;
