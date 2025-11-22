/**
 * DashboardPage Component
 * -----------------------
 * Main dashboard page matching the Figma design exactly.
 * Features sidebar navigation, announcements, and quick access cards.
 */

import { useState, useEffect } from "react";
import "./DashboardPage.css";
import { useDarkMode } from "../contexts/DarkModeContext";
import { supabase, TABLES } from "../lib/supabase";
import type { AnnouncementRow } from "../lib/supabase";
import FoothillLogo from "../assets/images/Foothill_College_logo.svg.png";
import ETILogo from "../assets/images/ETILOGO.png";

// Icons - Using SVG icons for better consistency
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HexagonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.documentElement.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Load announcements from localStorage
  const loadAnnouncementsFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("eti-announcements");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnnouncements(parsed);
      }
    } catch (error) {
      console.error("Error loading announcements from localStorage:", error);
    }
  };

  // Save announcements to localStorage
  const saveAnnouncementsToLocalStorage = (announcements: AnnouncementRow[]) => {
    try {
      localStorage.setItem("eti-announcements", JSON.stringify(announcements));
    } catch (error) {
      console.error("Error saving announcements to localStorage:", error);
    }
  };

  // Fetch announcements from database (fallback to localStorage if Supabase fails)
  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);

      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase not configured, using localStorage:", error);
        loadAnnouncementsFromLocalStorage();
        return;
      }

      if (data && data.length > 0) {
        setAnnouncements(data as AnnouncementRow[]);
        saveAnnouncementsToLocalStorage(data as AnnouncementRow[]);
      } else {
        // If no data from Supabase, load from localStorage
        loadAnnouncementsFromLocalStorage();
      }
    } catch (error) {
      console.warn("Error fetching from Supabase, using localStorage:", error);
      loadAnnouncementsFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Load announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Create a new announcement
  const createAnnouncement = async () => {
    if (!announcementText.trim()) {
      return;
    }

    try {
      // Try Supabase first
      await supabase.auth.getUser();

      const { data, error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .insert([
          {
            content: announcementText.trim(),
            user_id: undefined,
          },
        ])
        .select()
        .single();

      if (error || !data) {
        // Fallback to localStorage if Supabase fails
        console.warn("Supabase not available, using localStorage");

        const newAnnouncement: AnnouncementRow = {
          id: Date.now(), // Use timestamp as ID
          content: announcementText.trim(),
          user_id: undefined,
          created_at: new Date().toISOString(),
        };

        const updatedAnnouncements = [newAnnouncement, ...announcements];
        setAnnouncements(updatedAnnouncements);
        saveAnnouncementsToLocalStorage(updatedAnnouncements);
        setAnnouncementText("");
        return;
      }

      // If Supabase works, use the returned data
      const updatedAnnouncements = [data as AnnouncementRow, ...announcements];
      setAnnouncements(updatedAnnouncements);
      saveAnnouncementsToLocalStorage(updatedAnnouncements);
      setAnnouncementText("");
    } catch (error) {
      console.warn("Error with Supabase, using localStorage:", error);

      // Create announcement with localStorage
      const newAnnouncement: AnnouncementRow = {
        id: Date.now(),
        content: announcementText.trim(),
        user_id: undefined,
        created_at: new Date().toISOString(),
      };

      const updatedAnnouncements = [newAnnouncement, ...announcements];
      setAnnouncements(updatedAnnouncements);
      saveAnnouncementsToLocalStorage(updatedAnnouncements);
      setAnnouncementText("");
    }
  };

  // Delete an announcement
  const deleteAnnouncement = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      // Try to delete from Supabase
      const { error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .delete()
        .eq("id", id);

      if (error) {
        console.warn("Supabase not available, deleting from localStorage");
      }

      // Always update local state and localStorage
      const updatedAnnouncements = announcements.filter((ann) => ann.id !== id);
      setAnnouncements(updatedAnnouncements);
      saveAnnouncementsToLocalStorage(updatedAnnouncements);
    } catch (error) {
      console.warn("Error with Supabase, deleting from localStorage:", error);

      // Delete from localStorage
      const updatedAnnouncements = announcements.filter((ann) => ann.id !== id);
      setAnnouncements(updatedAnnouncements);
      saveAnnouncementsToLocalStorage(updatedAnnouncements);
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "long",
      day: "numeric",
      year: "numeric",
    };

    return date.toLocaleString("en-US", options);
  };

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Header Bar */}
      <div className="header-bar">
        <div className="header-left">
          <div className="foothill-logo">
            <img src={FoothillLogo} alt="Foothill College" className="foothill-logo-img" />
          </div>
          <div className="eti-logo">
            <img src={ETILogo} alt="ETI" className="eti-logo-img" />
          </div>
        </div>
        <div className="header-right">
          <button className="icon-button" aria-label="Dark mode toggle" onClick={toggleDarkMode}>
            <MoonIcon />
          </button>
          <button className="icon-button" aria-label="Help">
            <HelpIcon />
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <div className="sidebar">
          {/* User Profile Section */}
          <div className="user-profile-section">
            <div className="user-avatar-container">
              <div className="user-avatar">
                <span>A</span>
              </div>
              <button className="edit-badge">
                <span>Edit</span>
              </button>
            </div>
            <h2 className="user-greeting">Hello, Admin!</h2>
            <button className="logout-button">
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            <div className="nav-item active">
              <HomeIcon />
              <span className="nav-text">Dashboard</span>
            </div>

            <div className="nav-item" onClick={() => handleNavigation("staff")}>
              <UsersIcon />
              <span className="nav-text">Staff</span>
            </div>

            <div className="nav-item" onClick={() => handleNavigation("clubs")}>
              <HexagonIcon />
              <span className="nav-text">Clubs</span>
            </div>

            <div className="nav-item expandable" onClick={() => handleNavigation("laboratory")}>
              <CpuIcon />
              <span className="nav-text">Laboratory</span>
              <ChevronIcon />
            </div>

            <div className="nav-item" onClick={() => handleNavigation("search")}>
              <SearchIcon />
              <span className="nav-text">Search</span>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Page Title */}
          <h1 className="page-title">Your Dashboard</h1>

          {/* Announcements Section */}
          <div className="content-card announcements-card">
            <div className="card-header">
              <h2 className="section-title">Announcements</h2>
            </div>

            {/* New Announcement Input */}
            <div className="announcement-input-container">
              <div className="announcement-avatar">
                <span>A</span>
              </div>
              <div className="you-badge">You</div>
              <input
                type="text"
                className="announcement-input"
                placeholder="Enter announcement here..."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && announcementText.trim()) {
                    createAnnouncement();
                  }
                }}
                disabled={isLoading}
              />
              <button
                className="send-button"
                onClick={createAnnouncement}
                disabled={!announcementText.trim() || isLoading}
                aria-label="Send announcement"
              >
                <SendIcon />
              </button>
            </div>

            {/* Existing Announcements */}
            <div className="announcements-list">
              {isLoading && announcements.length === 0 ? (
                <div className="announcements-loading">
                  <p>Loading announcements...</p>
                </div>
              ) : announcements.length === 0 ? (
                <div className="announcements-empty">
                  <p>No announcements yet. Be the first to post one!</p>
                </div>
              ) : (
                <>
                  {/* Dynamic announcements */}
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="announcement-item">
                      <div className="announcement-avatar">
                        <span>A</span>
                      </div>
                      <div className="you-badge">You</div>
                      <div className="announcement-content">
                        <p className="announcement-text">{announcement.content}</p>
                        <p className="announcement-date">
                          {formatDate(announcement.created_at)}
                        </p>
                      </div>
                      <button
                        className="announcement-delete"
                        onClick={() => deleteAnnouncement(announcement.id)}
                        aria-label="Delete announcement"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="content-card quick-access-section">
            <div className="card-header">
              <h2 className="section-title">Quick Access</h2>
              <button className="edit-button" aria-label="Edit quick access">
                <EditIcon />
              </button>
            </div>

            <div className="quick-access-grid">
              {/* Projects & Events Card */}
              <div className="quick-card">
                <div className="quick-card-header">
                  <h3>Projects & Events</h3>
                  <button className="link-button" aria-label="Open projects and events">
                    <ExternalLinkIcon />
                  </button>
                </div>
                <div className="quick-card-content">
                  <ul className="events-list">
                    <li>Google Case Competition finalists present Sep 23</li>
                    <li>Sign ups for RSLS open Aug 1</li>
                  </ul>
                </div>
              </div>

              {/* Cameras Card */}
              <div className="quick-card cameras-card">
                <div className="quick-card-header">
                  <h3>Cameras</h3>
                  <button className="link-button" aria-label="Open cameras">
                    <ExternalLinkIcon />
                  </button>
                </div>
                <div className="cameras-content">
                  <button className="camera-nav left" aria-label="Previous camera">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="camera-placeholder"></div>
                  <button className="camera-nav right" aria-label="Next camera">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Lab Activity Card */}
              <div className="quick-card lab-activity-card">
                <div className="quick-card-header">
                  <h3>Lab Activity</h3>
                  <button className="link-button" aria-label="Open lab activity">
                    <ExternalLinkIcon />
                  </button>
                </div>
                <div className="lab-table-container">
                  <table className="activity-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>In</th>
                        <th>Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John Doe</td>
                        <td>4:37 PM 11/3</td>
                        <td>6:42 PM 11/3</td>
                      </tr>
                      <tr>
                        <td>John Doe</td>
                        <td>4:37 PM 11/3</td>
                        <td>6:42 PM 11/3</td>
                      </tr>
                      <tr>
                        <td>John Doe</td>
                        <td>4:37 PM 11/3</td>
                        <td>6:42 PM 11/3</td>
                      </tr>
                      <tr>
                        <td>John Doe</td>
                        <td>4:37 PM 11/3</td>
                        <td>6:42 PM 11/3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;