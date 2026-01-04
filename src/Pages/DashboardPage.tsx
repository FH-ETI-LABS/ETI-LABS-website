/**
 * DashboardPage Component
 * -----------------------
 * Role-aware global dashboard (SAFE + RLS-friendly)
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
  | "staff"
  | "clubs"
  | "projects"
  | "equipment"
  | "activity"
  | "metrics"
  | "search";

/* ================= STAFF LIST ================= */

const StaffList = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("staff")
        .select("id, first_name, last_name, email, role, lab_assigned")
        .order("last_name");

      if (data) setStaff(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p>Loading staff…</p>;
  if (staff.length === 0) return <p>No staff records found.</p>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {staff.map((s) => (
        <div key={s.id} className="content-card">
          <strong>
            {s.first_name} {s.last_name}
          </strong>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{s.email}</div>
          <div>Role: <strong>{s.role}</strong></div>
          {s.lab_assigned && <div>Lab: {s.lab_assigned}</div>}
        </div>
      ))}
    </div>
  );
};

/* ================= COMPONENT ================= */

const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
  const [labOpen, setLabOpen] = useState(false);

  const [staffProfile, setStaffProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    const loadProfile = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("user_id", auth.user.id)
        .maybeSingle();

      if (error || !data) {
        setProfileError("Staff profile not found. Contact admin.");
      } else {
        setStaffProfile(data);
      }

      setLoadingProfile(false);
    };

    const loadAnnouncements = async () => {
      const { data } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setAnnouncements(data);
    };

    loadProfile();
    loadAnnouncements();
  }, []);

  /* ================= ANNOUNCEMENTS ================= */

  const createAnnouncement = async () => {
    if (!announcementText.trim()) return;
    if (staffProfile.role !== "admin") return;

    await supabase.from(TABLES.ANNOUNCEMENTS).insert({
      content: announcementText.trim(),
      user_id: staffProfile.user_id,
    });

    setAnnouncementText("");

    const { data } = await supabase
      .from(TABLES.ANNOUNCEMENTS)
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setAnnouncements(data);
  };

  /* ================= STATES ================= */

  if (loadingProfile) return <div style={{ padding: 40 }}>Loading…</div>;

  if (profileError) {
    return (
      <div style={{ padding: 40 }}>
        <h2 style={{ color: "red" }}>Error</h2>
        <p>{profileError}</p>
        <button onClick={() => supabase.auth.signOut()}>
          Logout
        </button>
      </div>
    );
  }

  const isAdmin = staffProfile.role === "admin";
  const initial = staffProfile.first_name?.[0]?.toUpperCase() ?? "?";

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
            <div className="user-avatar">{initial}</div>
            <div className="user-greeting">Hello, {staffProfile.first_name}!</div>
           {isAdmin && <div className="admin-badge">🔥 Admin</div>}
            <button
              className="logout-button"
              onClick={() => supabase.auth.signOut()}
            >
              Logout
            </button>
          </div>

          <nav className="nav-menu">
            <div
              className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveView("dashboard")}
            >
              <HomeIcon /> <span className="nav-text">Dashboard</span>
            </div>

            {isAdmin && (
              <div
                className={`nav-item ${activeView === "staff" ? "active" : ""}`}
                onClick={() => setActiveView("staff")}
              >
                <UsersIcon /> <span className="nav-text">Staff</span>
              </div>
            )}

            <div
              className={`nav-item ${activeView === "clubs" ? "active" : ""}`}
              onClick={() => setActiveView("clubs")}
            >
              <HexagonIcon /> <span className="nav-text">Clubs</span>
            </div>

            <div
              className={`nav-item expandable ${labOpen ? "expanded" : ""}`}
              onClick={() => setLabOpen(!labOpen)}
            >
              <CpuIcon /> <span className="nav-text">Laboratory</span>
              <ChevronIcon />
            </div>

            {labOpen && (
              <div className="nav-submenu">
                <div onClick={() => setActiveView("projects")}>Projects</div>
                <div onClick={() => setActiveView("equipment")}>Equipment</div>
                <div onClick={() => setActiveView("activity")}>Activity</div>
                {isAdmin && (
                  <div onClick={() => setActiveView("metrics")}>Metrics</div>
                )}
              </div>
            )}

            <div
              className={`nav-item ${activeView === "search" ? "active" : ""}`}
              onClick={() => setActiveView("search")}
            >
              <SearchIcon /> <span className="nav-text">Search</span>
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {activeView === "dashboard" && (
            <>
              <h1 className="page-title">Your Dashboard</h1>

              <div className="content-card">
                <h2>Announcements</h2>

                {isAdmin && (
                  <div className="announcement-input-container">
                    <input
                      className="announcement-input"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="New announcement"
                    />
                    <button className="send-button" onClick={createAnnouncement}>
                      <SendIcon />
                    </button>
                  </div>
                )}

                {announcements.length === 0 && (
                  <p style={{ opacity: 0.6 }}>No announcements yet</p>
                )}

                {announcements.map((a) => (
                  <div key={a.id} className="announcement-item">
                    <p>{a.content}</p>
                    <small>
                      {a.created_at
                        ? new Date(a.created_at).toLocaleString()
                        : ""}
                    </small>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeView === "staff" && (
            <>
              <h1 className="page-title">Staff Directory</h1>
              <StaffList />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
