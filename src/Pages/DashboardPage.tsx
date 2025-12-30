/**
 * DashboardPage Component
 * -----------------------
 * Global dashboard layout with internal view switching
 * Header, sidebar, and dark mode persist across views
 */

import { useEffect, useState } from "react";
import "./DashboardPage.css";
import { useDarkMode } from "../contexts/DarkModeContext";
import { supabase, TABLES } from "../lib/supabase";
import type { AnnouncementRow } from "../lib/supabase";

import FoothillLogo from "../assets/images/Foothill_College_logo.svg.png";
import ETILogo from "../assets/images/ETILOGO.png";

/* ================= ICONS ================= */

const HomeIcon = () => <span>🏠</span>;
const UsersIcon = () => <span>👥</span>;
const HexagonIcon = () => <span>⬡</span>;
const CpuIcon = () => <span>🧪</span>;
const SearchIcon = () => <span>🔍</span>;
const ChevronIcon = () => <span>▾</span>;
const HelpIcon = () => <span>?</span>;
const SendIcon = () => <span>➤</span>;
const EditIcon = () => <span>✎</span>;

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 12.79A9 9 0 1111.21 3
         A7 7 0 0021 12.79z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

/* ================= TYPES ================= */

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

type DashboardView =
  | "dashboard"
  | "projects"
  | "equipment"
  | "activity"
  | "metrics";

/* ================= COMPONENT ================= */

const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
  const [labOpen, setLabOpen] = useState(false);

  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);

  /* ================= DATA ================= */

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from(TABLES.ANNOUNCEMENTS)
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setAnnouncements(data as AnnouncementRow[]);
  };

  const createAnnouncement = () => {
    if (!announcementText.trim()) return;

    setAnnouncements([
      {
        id: Date.now(),
        content: announcementText.trim(),
        created_at: new Date().toISOString(),
        user_id: undefined,
      },
      ...announcements,
    ]);

    setAnnouncementText("");
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  /* ================= RENDER ================= */

  return (
    <div className={`dashboard-container ${isDarkMode ? "dark-mode" : ""}`}>
      {/* HEADER */}
      <div className="header-bar">
        <div className="header-left">
          <img src={FoothillLogo} className="foothill-logo-img" />
          <img src={ETILogo} className="eti-logo-img" />
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

      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="user-profile-section">
            <div className="user-avatar">A</div>
            <div className="user-greeting">Hello, Admin!</div>
          </div>

          <nav className="nav-menu">
            <div
              className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveView("dashboard")}
            >
              <HomeIcon /> Dashboard
            </div>

            <div className="nav-item" onClick={() => onNavigate?.("staff")}>
              <UsersIcon /> Staff
            </div>

            <div className="nav-item" onClick={() => onNavigate?.("clubs")}>
              <HexagonIcon /> Clubs
            </div>

            <div
              className="nav-item expandable"
              onClick={() => setLabOpen(!labOpen)}
            >
              <CpuIcon /> Laboratory <ChevronIcon />
            </div>

            {labOpen && (
              <div className="nav-submenu">
                <div
                  className={`nav-subitem ${
                    activeView === "projects" ? "active" : ""
                  }`}
                  onClick={() => setActiveView("projects")}
                >
                  Projects
                </div>

                <div
                  className={`nav-subitem ${
                    activeView === "equipment" ? "active" : ""
                  }`}
                  onClick={() => setActiveView("equipment")}
                >
                  Equipment
                </div>

<div
  className={`nav-subitem ${activeView === "activity" ? "active" : ""}`}
  onClick={() => setActiveView("activity")}
>
  Activity
</div>
<div
  className={`nav-subitem ${activeView === "metrics" ? "active" : ""}`}
  onClick={() => setActiveView("metrics")}
>
  Metrics
</div>              </div>
            )}

            <div className="nav-item">
              <SearchIcon /> Search
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {activeView === "dashboard" && (
            <>
              <h1 className="page-title">Your Dashboard</h1>

              {/* ANNOUNCEMENTS */}
              <div className="content-card">
                <div className="card-header">
                  <h2 className="section-title">Announcements</h2>
                </div>

                <div className="announcement-input-container">
                  <div className="announcement-avatar">A</div>
                  <div className="you-badge">You</div>

                  <input
                    className="announcement-input"
                    value={announcementText}
                    onChange={e => setAnnouncementText(e.target.value)}
                    placeholder="New announcement"
                  />

                  <button
                    className="send-button"
                    onClick={createAnnouncement}
                    disabled={!announcementText.trim()}
                  >
                    <SendIcon />
                  </button>
                </div>

                <div className="announcements-list">
                  {announcements.map(a => (
                    <div key={a.id} className="announcement-item">
                      <div className="announcement-avatar">A</div>
                      <div className="you-badge">You</div>

                      <div className="announcement-content">
                        <p className="announcement-text">{a.content}</p>
                        <p className="announcement-date">
                          {new Date(a.created_at!).toLocaleString()}
                        </p>
                      </div>

                      <button
                        className="announcement-delete"
                        onClick={() => deleteAnnouncement(a.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK ACCESS */}
              <div className="content-card">
                <div className="card-header">
                  <h2 className="section-title">Quick Access</h2>
                  <button className="edit-button">
                    <EditIcon />
                  </button>
                </div>

                <div className="quick-access-grid">
                  <div className="quick-card">
                    <h3>Events</h3>
                    <ul className="events-list">
                      <li>Research & Service Leadership Symposium</li>
                      <li>Berkeley Symposium</li>
                      <li>Foothill × Google Case Competition</li>
                    </ul>
                  </div>

                  <div className="quick-card">
                    <h3>Cameras</h3>
                    <div className="cameras-content">
                      <button className="camera-nav">‹</button>
                      <div className="camera-placeholder" />
                      <button className="camera-nav">›</button>
                    </div>
                  </div>

                  <div className="quick-card">
                    <h3>Lab Activity</h3>
                    <table className="activity-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Action</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Admin</td>
                          <td>Created Project</td>
                          <td>2 mins ago</td>
                        </tr>
                        <tr>
                          <td>Admin</td>
                          <td>Updated Equipment</td>
                          <td>10 mins ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === "projects" && (
            <>
              <h1 className="page-title">Projects</h1>

              <div className="content-card">
                <strong>Project Name</strong>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>

              <div className="content-card">
                <strong>Project Name</strong>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>
            </>
          )}

          {activeView === "equipment" && (
            <>
              <h1 className="page-title">Equipment</h1>

              <div className="content-card">
                <strong>Camera A</strong>
                <p>Status: Available</p>
              </div>

              <div className="content-card">
                <strong>Sensor Kit</strong>
                <p>Status: In Use</p>
              </div>
            </>
          )}
          {activeView === "activity" && (
  <>
    <h1 className="page-title">Activity</h1>

    {/* SEARCH + FILTER BAR */}
    <div className="content-card">
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <input
          placeholder="Search Name..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            background: "var(--hover-bg)",
            color: "var(--text-primary)",
          }}
        />

        <button className="icon-button">Filter Date</button>
        <button className="icon-button">Filter Lab</button>
      </div>

      {/* ACTIVITY TABLE */}
      <div className="lab-table-container">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>CWID</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Date</th>
              <th>Lab</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td>Firstname Lastname</td>
                <td>12345678</td>
                <td>5:00 PM</td>
                <td>6:00 PM</td>
                <td>11/15/2025</td>
                <td>Lab 12345</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
)}
{activeView === "metrics" && (
  <>
    <h1 className="page-title">Metrics</h1>

    <div className="quick-access-grid">
      {/* NUMBERS */}
      <div className="content-card">
        <h2 className="section-title">Numbers</h2>
        <p>Active Clubs: <strong>12345</strong></p>
        <p>Open Laboratories: <strong>12345</strong></p>
        <p>Equipment: <strong>12345</strong></p>
        <p>Students Subscribed to Newsletter: <strong>12345</strong></p>
      </div>

      {/* PARTICULARS */}
      <div className="content-card">
        <h2 className="section-title">Particulars</h2>

        <p><strong>12345</strong> Total Staff</p>
        <p>20% in <strong>MESA</strong></p>

        <hr style={{ margin: "16px 0" }} />

        <p>Lab: <strong>12345</strong></p>
        <p>Visits this Quarter: <strong>12345</strong></p>
      </div>

      {/* PROJECTS & INNOVATION */}
      <div className="content-card">
        <h2 className="section-title">Projects & Innovation</h2>

        <p>Active Projects: <strong>12345</strong></p>
        <p>Completed Projects: <strong>12345</strong></p>

        <ul className="events-list">
          <li>5 projects in Google Case Competition</li>
          <li>2 projects in Foothill Innovation Challenge</li>
          <li>7 projects in Berkeley Symposium</li>
          <li>2 projects in RSLS</li>
          <li>4 projects in None</li>
        </ul>

        <hr style={{ margin: "16px 0" }} />

        <p>Awards / Honors: <strong>12345</strong></p>

        <div className="content-card" style={{ marginTop: 12 }}>
          <strong>Award / Honor Name</strong>
          <p style={{ marginTop: 8 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p style={{ fontSize: 12, opacity: 0.7 }}>
            Joe Shmoe, John Doe, Harry Potter · 2022
          </p>
        </div>
      </div>
    </div>
  </>
)}


        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
