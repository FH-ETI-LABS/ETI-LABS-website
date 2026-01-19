/**
 * DashboardPage Component
 * -----------------------
 * Role-aware global dashboard (SAFE + RLS-friendly)
 */

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import { useDarkMode } from "../contexts/DarkModeContext";
import { supabase, TABLES } from "../lib/supabase";
import type { AnnouncementRow } from "../lib/supabase";
import SearchPage from "./SearchPage";
import DashboardSections from "./DashboardSections";
import StaffList from "./StaffList";
import ClubsPage from "./ClubsPage";
import ProjectsPage from "./ProjectsPage";
import EquipmentPage from "./EquipmentPage";
import ActivityPage from "./ActivityPage";
import MetricsPage from "./MetricsPage";

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
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [claimingAdmin, setClaimingAdmin] = useState(false);
  const [claimAdminError, setClaimAdminError] = useState<string | null>(null);
  const [profileDraft, setProfileDraft] = useState({
    first_name: "",
    last_name: "",
    email: "",
    cwid: "",
    job_title: "Student",
    role: "ETI Member",
    lab_assigned: "ETI",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);

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

    const loadAdminStatus = async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("id")
        .eq("role", "admin")
        .limit(1);

      if (error) {
        console.debug("DashboardPage: admin check failed", error);
        setAdminExists(null);
        return;
      }
      setAdminExists((data ?? []).length > 0);
    };

    loadProfile();
    loadAnnouncements();
    loadAdminStatus();
    (async () => {
        try {
          const { data } = await supabase.auth.getUser();
          const user = data?.user ?? null;
          setAuthUser(user);
          if (user) {
            const pending = localStorage.getItem("pendingStaffProfile");
            if (pending) {
              try {
                const parsed = JSON.parse(pending);
                setProfileDraft((prev) => ({
                  ...prev,
                  ...parsed,
                  email: parsed.email || user.email || prev.email,
                }));
              } catch {}
            } else {
              setProfileDraft((prev) => ({
                ...prev,
                email: user.email || prev.email,
              }));
            }
          }
        } catch {}
    })();
  }, []);

  /* ================= ANNOUNCEMENTS ================= */

  const createAnnouncement = async () => {
    if (!announcementText.trim()) return;
    if (!staffProfile || staffProfile.role !== "admin") return;
    if (!staffProfile.user_id) {
      setProfileError("Staff profile is missing a linked user id.");
      return;
    }

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

  const handleProfileDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setProfileSaveError(null);
    if (!authUser?.id) {
      setProfileSaveError("Not authenticated.");
      return;
    }

    const requiredFields = [
      profileDraft.first_name.trim(),
      profileDraft.last_name.trim(),
      profileDraft.email.trim(),
      profileDraft.cwid.trim(),
      profileDraft.job_title.trim(),
      profileDraft.role.trim(),
      profileDraft.lab_assigned.trim(),
    ];

    if (requiredFields.some((field) => !field)) {
      setProfileSaveError("Please fill in all required fields.");
      return;
    }

    const cwidTrimmed = profileDraft.cwid.trim();
    if (!/^\d{8}$/.test(cwidTrimmed)) {
      setProfileSaveError("CWID must be exactly 8 digits.");
      return;
    }
    const cwidValue = Number(cwidTrimmed);

    setSavingProfile(true);
    const payload = {
      user_id: authUser.id,
      first_name: profileDraft.first_name.trim(),
      last_name: profileDraft.last_name.trim(),
      email: profileDraft.email.trim(),
      cwid: cwidValue,
      job_title: profileDraft.job_title.trim(),
      role: profileDraft.role.trim(),
      lab_assigned: profileDraft.lab_assigned.trim(),
    };

    const { data, error } = await supabase
      .from("staff")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.debug("DashboardPage: profile insert failed", error);
      setProfileSaveError(error.message || "Failed to save profile.");
      setSavingProfile(false);
      return;
    }

    setStaffProfile(data);
    setProfileSaveError(null);
    setSavingProfile(false);
    localStorage.removeItem("pendingStaffProfile");
  };

  const handleClaimAdmin = async () => {
    setClaimingAdmin(true);
    setClaimAdminError(null);

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        setClaimAdminError("Not authenticated.");
        setClaimingAdmin(false);
        return;
      }

      const { error } = await supabase
        .from("staff")
        .update({ role: "admin" })
        .eq("user_id", auth.user.id);

      if (error) {
        console.debug("DashboardPage: claim admin failed", error);
        setClaimAdminError(error.message || "Failed to claim admin access.");
        setClaimingAdmin(false);
        return;
      }

      setStaffProfile((prev: any) =>
        prev ? { ...prev, role: "admin" } : prev
      );
      setAdminExists(true);
      setClaimingAdmin(false);
    } catch (err) {
      setClaimAdminError("Failed to claim admin access.");
      setClaimingAdmin(false);
    }
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

  const isAdmin = staffProfile?.role === "admin";
  const initial = staffProfile?.first_name?.[0]?.toUpperCase() ?? "?";
  const canClaimAdmin =
    adminExists === false && !!staffProfile && authUser?.id === staffProfile.user_id;

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
          <div className="sidebar-card">
            <div className="user-profile-section">
              <div className="user-avatar">{initial}</div>
              <div className="user-greeting">
                Hello, {staffProfile?.first_name ?? "there"}!
              </div>
              {isAdmin && <div className="admin-badge">🔥 Admin</div>}
              {canClaimAdmin && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 10,
                    border: "1px solid #f3d49d",
                    borderRadius: 10,
                    background: "#fff7e6",
                    fontSize: 12,
                  }}
                >
                  <div style={{ marginBottom: 6, fontWeight: 600 }}>
                    No admin exists yet
                  </div>
                  <button
                    className="logout-button"
                    style={{ width: "100%", marginBottom: 6 }}
                    onClick={handleClaimAdmin}
                    disabled={claimingAdmin}
                  >
                    {claimingAdmin ? "Claiming..." : "Claim Admin Access"}
                  </button>
                  {claimAdminError && (
                    <div style={{ color: "#c53030" }}>{claimAdminError}</div>
                  )}
                </div>
              )}
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
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {profileErrorBanner}
          {!staffProfile && authUser && (
            <div className="content-card" style={{ marginBottom: 12 }}>
              <strong>Complete your profile</strong>
              <div style={{ opacity: 0.8, marginTop: 6 }}>
                Your account is created, but your staff profile is missing.
              </div>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <input
                  name="first_name"
                  placeholder="First name"
                  value={profileDraft.first_name}
                  onChange={handleProfileDraftChange}
                />
                <input
                  name="last_name"
                  placeholder="Last name"
                  value={profileDraft.last_name}
                  onChange={handleProfileDraftChange}
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={profileDraft.email}
                  onChange={handleProfileDraftChange}
                />
                <input
                  name="cwid"
                  placeholder="CWID"
                  value={profileDraft.cwid}
                  onChange={handleProfileDraftChange}
                />
                <input
                  name="job_title"
                  placeholder="Job title"
                  value={profileDraft.job_title}
                  onChange={handleProfileDraftChange}
                />
                <input
                  name="role"
                  placeholder="Role"
                  value={profileDraft.role}
                  onChange={handleProfileDraftChange}
                />
                <input
                  name="lab_assigned"
                  placeholder="Lab assigned"
                  value={profileDraft.lab_assigned}
                  onChange={handleProfileDraftChange}
                />
              </div>
              {profileSaveError && (
                <div style={{ color: "#c53030", marginTop: 8 }}>
                  {profileSaveError}
                </div>
              )}
              <button
                style={{ marginTop: 12 }}
                onClick={handleSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
            </div>
          )}
          {activeView === "dashboard" && (
            <>
              <h1 className="page-title dashboard-title">Your Dashboard</h1>

              {/* If staff profile is missing, show a small fallback summary using auth user */}
              {!staffProfile && authUser && (
                <div className="content-card" style={{ marginBottom: 12 }}>
                  <strong>Signed in as:</strong> {authUser.email ?? authUser.id}
                  <div style={{ opacity: 0.8 }}>Limited dashboard view — profile data not found.</div>
                </div>
              )}

              <div className="content-card dashboard-card">
                <h2 className="dashboard-card-title">Announcements</h2>

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

              <div className="content-card dashboard-card">
                <div className="quick-access-header">
                  <h2 className="dashboard-card-title">Quick Access</h2>
                </div>
                <DashboardSections showTitle={false} className="dashboard-quick-access" />
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
              <SearchPage />
            </>
          )}

          {activeView === "metrics" && (
            <>
              <h1 className="page-title">Metrics</h1>
              <MetricsPage />
            </>
          )}

          {activeView === "activity" && (
            <>
              <h1 className="page-title">Activity</h1>
              <ActivityPage />
            </>
          )}

          {activeView === "equipment" && (
            <>
              <h1 className="page-title">Equipment</h1>
              <EquipmentPage />
            </>
          )}

          {activeView === "projects" && (
            <>
              <h1 className="page-title">Projects</h1>
              <ProjectsPage />
            </>
          )}

          {activeView === "clubs" && (
            <>
              <h1 className="page-title">Clubs</h1>
              <ClubsPage />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
