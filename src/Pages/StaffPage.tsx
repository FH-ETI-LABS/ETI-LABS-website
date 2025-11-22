/**
 * StaffPage Component
 * -------------------
 * Staff directory page displaying all staff members with search functionality.
 */

import { useState, useEffect } from "react";
import "./StaffPage.css";
import { useDarkMode } from "../contexts/DarkModeContext";
import { supabase, TABLES, type StaffRow } from "../lib/supabase";
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

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Sample staff data for demonstration
const SAMPLE_STAFF: StaffRow[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe Smith",
    job_title: "Officer",
    role: "Staff",
    lab_assigned: "Lab 1",
    community_fws: true,
    community_mesa: true,
    community_umoja: true,
    community_puente: true,
    community_veteran: true,
    email: "example@gmail.com",
    telephone: "(123) 456-7890",
    cwid: 20685922,
  },
  {
    id: 2,
    first_name: "John",
    last_name: "Doe Smith",
    job_title: "Officer",
    role: "Staff",
    lab_assigned: "Lab 1",
    community_fws: true,
    community_mesa: true,
    community_umoja: true,
    community_puente: true,
    community_veteran: true,
    email: "example@gmail.com",
    telephone: "(123) 456-7890",
    cwid: 20685922,
  },
  {
    id: 3,
    first_name: "John",
    last_name: "Doe Smith",
    job_title: "Officer",
    role: "Staff",
    lab_assigned: "Lab 1",
    community_fws: true,
    community_mesa: true,
    community_umoja: true,
    community_puente: true,
    community_veteran: true,
    email: "example@gmail.com",
    telephone: "(123) 456-7890",
    cwid: 20685922,
  },
];

interface StaffPageProps {
  onNavigate?: (page: string) => void;
}

const StaffPage = ({ onNavigate }: StaffPageProps) => {
  const [staffMembers, setStaffMembers] = useState<StaffRow[]>([]);
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

  // Load staff from localStorage
  const loadStaffFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("eti-staff");
      if (saved) {
        const parsed = JSON.parse(saved);
        setStaffMembers(parsed);
      } else {
        // Use sample data if no data exists
        setStaffMembers(SAMPLE_STAFF);
        localStorage.setItem("eti-staff", JSON.stringify(SAMPLE_STAFF));
      }
    } catch (error) {
      console.error("Error loading staff from localStorage:", error);
      setStaffMembers(SAMPLE_STAFF);
    }
  };

  // Fetch staff from database
  const fetchStaff = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from(TABLES.STAFF)
        .select("*")
        .order("last_name", { ascending: true });

      if (error) {
        console.warn("Supabase not configured, using localStorage:", error);
        loadStaffFromLocalStorage();
        return;
      }

      if (data && data.length > 0) {
        setStaffMembers(data as StaffRow[]);
        localStorage.setItem("eti-staff", JSON.stringify(data));
      } else {
        loadStaffFromLocalStorage();
      }
    } catch (error) {
      console.warn("Error fetching from Supabase, using localStorage:", error);
      loadStaffFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filter staff based on search query
  const filteredStaff = staffMembers.filter((staff) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${staff.first_name} ${staff.last_name}`.toLowerCase();
    const cwid = staff.cwid.toString();

    return (
      fullName.includes(query) ||
      staff.job_title.toLowerCase().includes(query) ||
      staff.lab_assigned.toLowerCase().includes(query) ||
      cwid.includes(query) ||
      staff.email.toLowerCase().includes(query)
    );
  });

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className={`staff-container ${isDarkMode ? "dark-mode" : ""}`}>
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

      <div className="staff-layout">
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

            <div className="nav-item active">
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
          <h1 className="page-title">Staff</h1>

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

          {/* Staff List */}
          <div className="staff-list">
            {isLoading ? (
              <div className="staff-loading">
                <p>Loading staff members...</p>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="staff-empty">
                <p>No staff members found.</p>
              </div>
            ) : (
              filteredStaff.map((staff) => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-avatar">
                    <span>{staff.first_name.charAt(0)}</span>
                  </div>

                  <div className="staff-info">
                    <h3 className="staff-name">
                      {staff.first_name} {staff.last_name}
                    </h3>
                    <p className="staff-title">
                      {staff.job_title}, {staff.cwid}
                    </p>
                    <div className="staff-badges">
                      {staff.community_mesa && (
                        <span className="badge badge-mesa">MESA</span>
                      )}
                      {staff.community_fws && (
                        <span className="badge badge-fws">FWS</span>
                      )}
                      {staff.community_umoja && (
                        <span className="badge badge-umoja">Umoja</span>
                      )}
                      {staff.community_puente && (
                        <span className="badge badge-puente">Puente</span>
                      )}
                      {staff.community_veteran && (
                        <span className="badge badge-veteran">Veteran</span>
                      )}
                    </div>
                  </div>

                  <div className="staff-lab">
                    <h4 className="section-label">Lab</h4>
                    <div className="info-row">
                      <LocationIcon />
                      <span>{staff.lab_assigned}</span>
                    </div>
                  </div>

                  <div className="staff-contact">
                    <h4 className="section-label">Contact</h4>
                    <div className="info-row">
                      <EmailIcon />
                      <span>{staff.email}</span>
                    </div>
                    <div className="info-row">
                      <PhoneIcon />
                      <span>{staff.telephone}</span>
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

export default StaffPage;
