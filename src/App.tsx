/**
 * App Component
 * -------------
 * Main application component with page routing.
 */

import { useState } from "react";
import DashboardPage from "./Pages/DashboardPage";
import StaffPage from "./Pages/StaffPage";
import ClubsPage from "./Pages/ClubsPage";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { UserProvider } from "./contexts/UserContext";
import "./Pages/DashboardPage.css";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={handleNavigation} />;
      case "staff":
        return <StaffPage onNavigate={handleNavigation} />;
      case "clubs":
        return <ClubsPage onNavigate={handleNavigation} />;
      case "laboratory":
        return (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>Laboratory Page</h1>
            <p>Coming soon...</p>
            <button onClick={() => handleNavigation("dashboard")}>Back to Dashboard</button>
          </div>
        );
      case "search":
        return (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>Search Page</h1>
            <p>Coming soon...</p>
            <button onClick={() => handleNavigation("dashboard")}>Back to Dashboard</button>
          </div>
        );
      default:
        return <DashboardPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <DarkModeProvider>
      <UserProvider>
        {renderPage()}
      </UserProvider>
    </DarkModeProvider>
  );
}

export default App;
