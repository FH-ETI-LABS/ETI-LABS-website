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

type DashboardView = "dashboard" | "projects" | "equipment";

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

                <div className="nav-subitem disabled">Activity</div>
                <div className="nav-subitem disabled">Metrics</div>
              </div>
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
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
