/**
 * DashboardPage Component
 * -----------------------
 * Role-aware global dashboard (SAFE + RLS-friendly)
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

// DashboardPage does not accept external navigation props when used via router
// (navigation is handled in-app). Removing unused prop to satisfy strict lint rules.

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

const DashboardPage = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Navigate to landing first to avoid route-guard racing to /login when
    // onAuthStateChange clears the session. Then attempt signOut.
    navigate("/", { replace: true });
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.debug("DashboardPage: signOut failed", err);
    }
  };

  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
  const [labOpen, setLabOpen] = useState(false);

  const [staffProfile, setStaffProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [authUser, setAuthUser] = useState<any>(null);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    const loadProfile = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        // No authenticated user available — stop the loading state and show an error.
        console.debug("DashboardPage: no auth user returned from supabase.getUser", { auth });
        setProfileError("Not authenticated. Please sign in.");
        setLoadingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("staff")
          .select("*")
          .eq("user_id", auth.user.id)
          .maybeSingle();

        if (error || !data) {
          console.debug("DashboardPage: staff fetch did not return data", { error });
          setProfileError("Staff profile not found. Contact admin.");
        } else {
          console.debug("DashboardPage: staff profile loaded", { id: data.id });
          setStaffProfile(data);
        }
      } catch (err) {
        setProfileError("Failed to load profile. Please try again.");
      } finally {
        setLoadingProfile(false);
      }
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
    (async () => {
        try {
          const { data } = await supabase.auth.getUser();
          setAuthUser(data?.user ?? null);
        } catch {}
    })();
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

  // Don't return early on profile errors; show an inline banner so the
  // rest of the dashboard still renders. This avoids a completely blank
  // page when a staff profile is missing but the user is authenticated.
  const profileErrorBanner =
    profileError ? (
      <div style={{ padding: 12, background: "#fff3f3", border: "1px solid #ffd0d0", marginBottom: 12 }}>
        <strong style={{ color: "#c53030" }}>Notice:</strong> {profileError}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => window.location.reload()}>Retry</button>
          <button style={{ marginLeft: 8 }} onClick={() => handleLogout()}>
            Logout
          </button>
        </div>
      </div>
    ) : null;

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
              onClick={() => handleLogout()}
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
          {profileErrorBanner}
          {activeView === "dashboard" && (
            <>
              <h1 className="page-title">Your Dashboard</h1>

              {/* If staff profile is missing, show a small fallback summary using auth user */}
              {!staffProfile && authUser && (
                <div className="content-card" style={{ marginBottom: 12 }}>
                  <strong>Signed in as:</strong> {authUser.email ?? authUser.id}
                  <div style={{ opacity: 0.8 }}>Limited dashboard view — profile data not found.</div>
                </div>
              )}

              <div className="content-card">
                <h2>Announcements</h2>

                {/* Debug panel: show raw session / profile info so we can see why dashboard appears blank */}
                {/* Debug panel removed: session/profile debug information hidden in production view */}

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

          {activeView === "search" && (
            <>
              <h1 className="page-title">Search</h1>
              <div className="search-panel">
                <div className="search-input-row">
                  <SearchIcon />
                  <input className="search-input" placeholder="Search..." />
                </div>

                <div className="search-results">
                  {["Site Page", "Site Page", "Site Page", "Site Page", "Site Page"].map((title, idx) => (
                    <div key={`${title}-${idx}`} className="search-result-card">
                      <strong>{title}</strong>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor tincidunt
                        ligula consequat fermentum.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeView === "metrics" && (
            <>
              <h1 className="page-title">Metrics</h1>
              <div className="metrics-layout">
                <section className="metrics-left">
                  <div className="metrics-card">
                    <h2>Numbers</h2>
                    <ul className="metrics-list">
                      <li>
                        <span>Active Clubs</span>
                        <strong>12345</strong>
                      </li>
                      <li>
                        <span>Open Laboratories</span>
                        <strong>12345</strong>
                      </li>
                      <li>
                        <span>Equipment</span>
                        <strong>12345</strong>
                      </li>
                      <li>
                        <span>Students Subscribed to Newsletter</span>
                        <strong>12345</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="metrics-card">
                    <h2>Particulars</h2>
                    <div className="metrics-particulars">
                      <div className="metrics-donut">
                        <div className="donut-ring" />
                        <div>
                          <div className="metrics-label">Total Staff</div>
                          <div className="metrics-value">12345</div>
                          <div className="metrics-chip">20% in MESA</div>
                        </div>
                      </div>
                      <div className="metrics-trend">
                        <div className="trend-chart">
                          <div className="trend-bar tall" />
                          <div className="trend-bar" />
                          <div className="trend-bar tallest" />
                        </div>
                        <div>
                          <div className="metrics-label">Lab Visits this Quarter</div>
                          <div className="metrics-value">12345</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="metrics-right">
                  <div className="metrics-card metrics-right-card">
                    <div className="metrics-card-header">
                      <h2>Projects &amp; Innovation</h2>
                      <div className="mini-bars">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                    <div className="metrics-summary">
                      <div>
                        <div className="metrics-label">Active Projects</div>
                        <strong>12345</strong>
                      </div>
                      <div>
                        <div className="metrics-label">Completed Projects</div>
                        <strong>12345</strong>
                      </div>
                    </div>
                    <div className="metrics-tags">
                      <span>5 projects in Google Case Competition</span>
                      <span>2 projects in Foothill Innovation Challenge</span>
                      <span>7 projects in Berkeley Symposium</span>
                      <span>2 projects in RSLS</span>
                      <span>4 projects in None</span>
                    </div>

                    <div className="metrics-divider" />

                    <div className="metrics-awards">
                      <div className="metrics-awards-header">
                        <h3>Awards/Honors</h3>
                        <strong>12345</strong>
                      </div>
                      <div className="award-card">
                        <div className="award-eyebrow">Recent Highlights</div>
                        <div className="award-title">Award/Honor Name</div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor tincidunt
                          ligula consequat fermentum.
                        </p>
                        <div className="award-footer">
                          <span>Joe, John Doe, Harry Potter</span>
                          <span>2022</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {activeView === "activity" && (
            <>
              <h1 className="page-title">Activity</h1>
              <div className="activity-panel">
                <div className="activity-toolbar">
                  <div className="activity-search">
                    <SearchIcon />
                    <input placeholder="Search Name..." />
                  </div>
                  <div className="activity-filters">
                    <button type="button">Filter Date</button>
                    <button type="button">Filter Lab</button>
                  </div>
                </div>

                <div className="activity-table">
                  <div className="activity-row activity-header">
                    <div>Name</div>
                    <div>CWID</div>
                    <div>Time In</div>
                    <div>Time Out</div>
                    <div>Date</div>
                    <div>Lab</div>
                  </div>
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={`activity-${idx}`} className="activity-row">
                      <div>Firstname Lastname</div>
                      <div>12345678</div>
                      <div>5:00 PM</div>
                      <div>6:00 PM</div>
                      <div>11/15/2025</div>
                      <div>Lab 12345</div>
                    </div>
                  ))}
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
