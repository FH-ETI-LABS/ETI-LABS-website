import "./LandingPage.css";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const LandingPage = ({ onNavigate }: LandingPageProps) => {
  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className="landing-header">
        <div className="logo">
          <strong>Foothill × ETI</strong>
        </div>

        <div className="header-actions">
          <button
            className="btn-outline"
            onClick={() => onNavigate("login")}
          >
            Log In
          </button>
          <button
            className="btn-primary"
            onClick={() => onNavigate("create-account")}
          >
            Create Account
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>ETI Lab Management System</h1>
        <p>
          Manage staff, laboratories, equipment, activity logs, and metrics
          — all in one centralized platform.
        </p>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => onNavigate("create-account")}
          >
            Get Started
          </button>
          <button
            className="btn-outline"
            onClick={() => onNavigate("login")}
          >
            Log In
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <h3>Staff Management</h3>
          <p>View and manage lab staff and assignments.</p>
        </div>

        <div className="feature-card">
          <h3>Equipment Tracking</h3>
          <p>Track availability and usage of lab equipment.</p>
        </div>

        <div className="feature-card">
          <h3>Activity Logs</h3>
          <p>Monitor lab usage and user activity.</p>
        </div>

        <div className="feature-card">
          <h3>Metrics & Reports</h3>
          <p>Get insights with real-time lab metrics.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
