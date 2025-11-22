/**
 * ClubsPage Component
 * -------------------
 * Clubs directory page displaying all STEM clubs with search functionality.
 */

import { useState, useEffect } from "react";
import "./ClubsPage.css";
import { useDarkMode } from "../contexts/DarkModeContext";
import { supabase, TABLES, type StemClubRow } from "../lib/supabase";
import FoothillLogo from "../assets/images/Foothill_College_logo.svg.png";
import ETILogo from "../assets/images/ETILOGO.png";

// Icons
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HexagonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Sample clubs data for demonstration
const SAMPLE_CLUBS: StemClubRow[] = [
  {
    id: 1,
    name: "Club Name",
    president: "Joe Shmoe",
    advisor: "John Doe Smith",
    meeting_time: "Friday 5:00PM - 6:00PM",
    location: "Building 123",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor tincidunt ligula consequat fermentum. Sed cursus dapibus aliquet. Proin nisl libero, porttitor sit amet porta sed, rhoncus cursus justo.",
    discord_link: "www.discord.com",
  },
  {
    id: 2,
    name: "Club Name",
    president: "Joe Shmoe",
    advisor: "John Doe Smith",
    meeting_time: "Friday 5:00PM - 6:00PM",
    location: "Building 123",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor tincidunt ligula consequat fermentum. Sed cursus dapibus aliquet. Proin nisl libero, porttitor sit amet porta sed, rhoncus cursus justo.",
    discord_link: "www.discord.com",
  },
  {
    id: 3,
    name: "Club Name",
    president: "Joe Shmoe",
    advisor: "John Doe Smith",
    meeting_time: "Friday 5:00PM - 6:00PM",
    location: "Building 123",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor tincidunt ligula consequat fermentum. Sed cursus dapibus aliquet. Proin nisl libero, porttitor sit amet porta sed, rhoncus cursus justo.",
    discord_link: "www.discord.com",
  },
  {
    id: 4,
    name: "Club Name",
    president: "Joe Shmoe",
    advisor: "John Doe Smith",
    meeting_time: "Friday 5:00PM - 6:00PM",
    location: "Building 123",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor tincidunt ligula consequat fermentum. Sed cursus dapibus aliquet. Proin nisl libero, porttitor sit amet porta sed, rhoncus cursus justo.",
    discord_link: "www.discord.com",
  },
];

interface ClubsPageProps {
  onNavigate?: (page: string) => void;
}

const ClubsPage = ({ onNavigate }: ClubsPageProps) => {
  const [clubs, setClubs] = useState<StemClubRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Load clubs from localStorage
  const loadClubsFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("eti-clubs");
      if (saved) {
        const parsed = JSON.parse(saved);
        setClubs(parsed);
      } else {
        // Use sample data if no data exists
        setClubs(SAMPLE_CLUBS);
        localStorage.setItem("eti-clubs", JSON.stringify(SAMPLE_CLUBS));
      }
    } catch (error) {
      console.error("Error loading clubs from localStorage:", error);
      setClubs(SAMPLE_CLUBS);
    }
  };

  // Fetch clubs from database
  const fetchClubs = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from(TABLES.STEM_CLUBS)
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.warn("Supabase not configured, using localStorage:", error);
        loadClubsFromLocalStorage();
        return;
      }

      if (data && data.length > 0) {
        setClubs(data as StemClubRow[]);
        localStorage.setItem("eti-clubs", JSON.stringify(data));
      } else {
        loadClubsFromLocalStorage();
      }
    } catch (error) {
      console.warn("Error fetching from Supabase, using localStorage:", error);
      loadClubsFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // Filter clubs based on search query
  const filteredClubs = clubs.filter((club) => {
    const query = searchQuery.toLowerCase();
    return (
      club.name.toLowerCase().includes(query) ||
      club.president.toLowerCase().includes(query) ||
      club.advisor.toLowerCase().includes(query) ||
      club.description.toLowerCase().includes(query) ||
      club.location.toLowerCase().includes(query)
    );
  });

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className={`clubs-container ${isDarkMode ? "dark-mode" : ""}`}>
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

      <div className="clubs-layout">
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
            <div className="nav-item" onClick={() => handleNavigation("dashboard")}>
              <HomeIcon />
              <span className="nav-text">Dashboard</span>
            </div>

            <div className="nav-item" onClick={() => handleNavigation("staff")}>
              <UsersIcon />
              <span className="nav-text">Staff</span>
            </div>

            <div className="nav-item active">
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
          <h1 className="page-title">Clubs</h1>

          {/* Search Bar */}
          <div className="search-container">
            <SearchIcon />
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Clubs Grid */}
          <div className="clubs-grid">
            {isLoading ? (
              <div className="clubs-loading">
                <p>Loading clubs...</p>
              </div>
            ) : filteredClubs.length === 0 ? (
              <div className="clubs-empty">
                <p>No clubs found.</p>
              </div>
            ) : (
              filteredClubs.map((club) => (
                <div key={club.id} className="club-card">
                  <h3 className="club-name">{club.name}</h3>

                  <div className="club-info-row">
                    <span className="info-label">President:</span>
                    <span className="info-value">{club.president}</span>
                  </div>

                  <div className="club-info-row">
                    <span className="info-label">Advisor:</span>
                    <span className="info-value">{club.advisor}</span>
                  </div>

                  <p className="club-description">{club.description}</p>

                  <div className="club-details">
                    {club.discord_link && (
                      <div className="detail-row">
                        <LinkIcon />
                        <span>{club.discord_link}</span>
                      </div>
                    )}

                    <div className="detail-row">
                      <ClockIcon />
                      <span>{club.meeting_time}</span>
                    </div>

                    <div className="detail-row">
                      <LocationIcon />
                      <span>{club.location}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;
