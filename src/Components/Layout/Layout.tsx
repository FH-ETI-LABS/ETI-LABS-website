/**
 * Layout Component
 * ----------------
 * Reusable layout with sidebar navigation and header.
 * Used across all dashboard pages for consistent UI.
 */

import { type ReactNode, useState } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useUser } from "../../contexts/UserContext";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import "./Layout.css";

// Image URLs from Figma API
const imgIconColor = "https://www.figma.com/api/mcp/asset/1454710d-5f2e-4502-803c-33f8436c363f";
const imgImage5 = "https://www.figma.com/api/mcp/asset/06838d21-73cd-41d9-8c38-e2a088f0fa4b"; // Foothill acorn logo
const imgIcon = "https://www.figma.com/api/mcp/asset/57decf9e-7604-48f0-9f87-4cdad8575510";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/6197d05c-1f20-41f6-aa13-5164e13744a6";
const imgIcon4 = "https://www.figma.com/api/mcp/asset/c0676025-cc48-4827-a955-d2225c7de2fa";
const imgIcon5 = "https://www.figma.com/api/mcp/asset/3300c924-1434-4d3f-8419-446df4d0add1";
const imgIcon6 = "https://www.figma.com/api/mcp/asset/c3bf5a93-ceb1-4b65-93d2-2d6cb2e7d507";
const imgIcon8 = "https://www.figma.com/api/mcp/asset/7730b9ae-e9fe-446a-848b-da383b6240b1";
const imgIcon9 = "https://www.figma.com/api/mcp/asset/2094c8ab-2c51-4462-9651-f11554978da6";
const imgIcon10 = "https://www.figma.com/api/mcp/asset/bec317ca-7e2e-4ea6-9a3e-5ae6ec9a2ec6";
const imgIcon11 = "https://www.figma.com/api/mcp/asset/9944ab22-5e62-40d5-a8ca-0a0f69f840bb";

interface LayoutProps {
  children: ReactNode;
  currentPage: "dashboard" | "staff" | "clubs" | "laboratory" | "search";
  onNavigate: (page: string) => void;
}

const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className={`layout-container ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Left Sidebar */}
      <div className="sidebar">
        {/* Top Logo Section */}
        <div className="sidebar-top">
          <div className="foothill-logo-container">
            <img src={imgImage5} alt="Foothill College Logo" className="foothill-logo" />
          </div>
          <div className="icon-color-container">
            <img src={imgIconColor} alt="ETI Logo" className="icon-color" />
          </div>
        </div>

        {/* User Profile Section */}
        <div className="user-profile-section">
          <div className="user-avatar-container">
            <img src={user.avatarUrl} alt="User Avatar" className="user-avatar" />
            <button
              className="edit-badge"
              onClick={() => setIsEditModalOpen(true)}
            >
              <span className="edit-text">Edit</span>
            </button>
          </div>
          <h2 className="user-greeting">Hello, {user.name}!</h2>
          <button
            className="logout-button"
            onClick={() => {
              console.log("Logout clicked");
            }}
          >
            <img src={imgIcon8} alt="Logout" className="logout-icon" />
            <span className="logout-text">Logout</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="nav-menu">
          {/* Dashboard */}
          <div
            className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => onNavigate("dashboard")}
          >
            <img src={imgIcon1} alt="Home" className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </div>

          {/* Staff */}
          <div
            className={`nav-item ${currentPage === "staff" ? "active" : ""}`}
            onClick={() => onNavigate("staff")}
          >
            <img src={imgIcon11} alt="Users" className="nav-icon" />
            <span className="nav-text">Staff</span>
          </div>

          {/* Clubs */}
          <div
            className={`nav-item ${currentPage === "clubs" ? "active" : ""}`}
            onClick={() => onNavigate("clubs")}
          >
            <img src={imgIcon10} alt="Hexagon" className="nav-icon" />
            <span className="nav-text">Clubs</span>
          </div>

          {/* Laboratory */}
          <div
            className={`nav-item ${currentPage === "laboratory" ? "active" : ""}`}
            onClick={() => onNavigate("laboratory")}
          >
            <img src={imgIcon9} alt="CPU" className="nav-icon" />
            <span className="nav-text">Laboratory</span>
            <img src={imgIcon4} alt="Chevron" className="chevron-icon" />
          </div>

          {/* Search */}
          <div
            className={`nav-item ${currentPage === "search" ? "active" : ""}`}
            onClick={() => onNavigate("search")}
          >
            <img src={imgIcon} alt="Search" className="nav-icon" />
            <span className="nav-text">Search</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <div className="top-header">
          <div className="header-icons">
            <img src={imgIcon6} alt="Help" className="header-icon" />
            <img
              src={imgIcon5}
              alt="Moon"
              className="header-icon moon-icon"
              onClick={toggleDarkMode}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default Layout;
