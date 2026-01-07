import { useNavigate } from "react-router-dom";
import "./landingpage.css";

const LABS = [
  { id: "ai", title: "Artificial Intelligence" },
  { id: "cybersecurity", title: "Cybersecurity" },
  { id: "xr", title: "Extended Reality (XR)" },
  { id: "energy", title: "Energy Technologies" },
  { id: "lifesciences", title: "Life Sciences" },
  { id: "quantum", title: "Quantum & Space Systems" },
];

type LandingPageProps = {
  onNavigate?: (page: "login" | "create-account") => void;
};

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const navigate = useNavigate();
  

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">ETI</div>

        <div className="landing-actions">
          <button
            className="secondary"
            onClick={() => {
              if (onNavigate) onNavigate("login");
              else navigate("/login");
            }}
          >
            Sign In
          </button>
          <button
            className="primary"
            onClick={() => {
              if (onNavigate) onNavigate("create-account");
              else navigate("/create-account");
            }}
          >
            Create Account
          </button>
        </div>
      </header>

      <section className="hero">
        <h1>Emerging Technologies Institute</h1>
        <p>
          A hands-on innovation hub at Foothill College where students explore,
          build, and lead in cutting-edge technologies.
        </p>
      </section>

        {/* Login is a dedicated page now; the Sign In button navigates to /login */}

      <section className="section">
        <h2>Labs & Focus Areas</h2>

        <div className="grid">
          {LABS.map((lab) => (
            <div key={lab.id} className="card" onClick={() => navigate(`/labs/${lab.id}`)}>
              <div style={{ fontWeight: 700 }}>{lab.title}</div>
              <div style={{ opacity: 0.7, marginTop: 6 }}>Click to preview →</div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Access ETI Labs</h2>
        <p>Log in to manage projects, equipment, and lab activity.</p>
        <button className="primary" onClick={() => (onNavigate ? onNavigate("login") : navigate("/login"))}>
          Continue to Login
        </button>
      </section>
    </div>
  );
}
