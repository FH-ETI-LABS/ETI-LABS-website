/**
 * ProjectsPage Component
 * ----------------------
 * Laboratory Projects page using the SAME layout as StaffPage.
 * Sidebar + header never disappear.
 */

import { useState, useEffect } from "react";
import "./ProjectsPage.css";
//import "./DashboardPage.css";  // ← the good one with sidebar, header, dark mode, etc.
import { useDarkMode } from "../contexts/DarkModeContext";
import FoothillLogo from "../assets/images/Foothill_College_logo.svg.png";
import ETILogo from "../assets/images/ETILOGO.png";

/* ===== Icons (copied pattern from StaffPage) ===== */

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HexagonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2"/>
    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M21 12.79A9 9 0 1111.21 3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

/* ===== Props ===== */

interface ProjectsPageProps {
  onNavigate?: (page: string) => void;
}

/* ===== Component ===== */

const ProjectsPage = ({ onNavigate }: ProjectsPageProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [labOpen, setLabOpen] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const go = (page: string) => onNavigate?.(page);

  return (
    <div className={`projects-container ${isDarkMode ? "dark-mode" : ""}`}>

      {/* ===== Header ===== */}
      <div className="header-bar">
        <div className="header-left">
          <img src={FoothillLogo} alt="Foothill College" />
          <img src={ETILogo} alt="ETI" />
        </div>
        <div className="header-right">
          <button className="icon-button" onClick={toggleDarkMode}>
            <MoonIcon />
          </button>
          <button className="icon-button">
            <HelpIcon />
          </button>
        </div>
      </div>

      <div className="staff-layout">
        {/* ===== Sidebar ===== */}
        <div className="sidebar">
          <div className="user-profile-section">
            <div className="user-avatar"><span>A</span></div>
            <h2 className="user-greeting">Hello, Admin!</h2>
            <button className="logout-button">
              <LogoutIcon /> Logout
            </button>
          </div>

          <nav className="nav-menu">
            <div className="nav-item" onClick={() => go("dashboard")}>
              <HomeIcon /> Dashboard
            </div>

            <div className="nav-item" onClick={() => go("staff")}>
              <UsersIcon /> Staff
            </div>

            <div className="nav-item" onClick={() => go("clubs")}>
              <HexagonIcon /> Clubs
            </div>

            <div
              className="nav-item expandable active"
              onClick={() => setLabOpen(!labOpen)}
            >
              <CpuIcon /> Laboratory <ChevronIcon />
            </div>

            {labOpen && (
              <div className="nav-submenu">
                <div className="nav-subitem active">Projects</div>
                <div className="nav-subitem disabled">Equipment</div>
                <div className="nav-subitem disabled">Activity</div>
                <div className="nav-subitem disabled">Metrics</div>
              </div>
            )}

            <div className="nav-item" onClick={() => go("search")}>
              <SearchIcon /> Search
            </div>
          </nav>
        </div>

        {/* ===== Main Content ===== */}
        <div className="main-content">
          <h1 className="page-title">Projects</h1>

          <div className="projects-list">
            <div className="project-card">
              <h3>Project Name</h3>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>

            <div className="project-card">
              <h3>Project Name</h3>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
