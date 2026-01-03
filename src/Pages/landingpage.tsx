import "./landingpage.css";
import FoothillLogo from "../assets/images/Foothill_College_logo.svg.png";
import ETILogo from "../assets/images/ETILOGO.png";

interface LandingPageProps {
  onNavigate: (page: "login" | "create-account") => void;
}

const LandingPage = ({ onNavigate }: LandingPageProps) => {
  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className="landing-header">
        <img src={FoothillLogo} alt="Foothill College" />
        <img src={ETILogo} alt="ETI Labs" />
        <div className="landing-actions">
          <button className="secondary" onClick={() => onNavigate("login")}>
            Sign In
          </button>
          <button className="primary" onClick={() => onNavigate("create-account")}>
            Create Account
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Emerging Technologies Institute</h1>
        <p>
          A hands-on innovation hub at Foothill College where students explore,
          build, and lead in cutting-edge technologies.
        </p>
      </section>

      {/* LABS */}
      <section className="section">
        <h2>Labs & Focus Areas</h2>
        <div className="grid">
          <div className="card">Artificial Intelligence</div>
          <div className="card">Cybersecurity</div>
          <div className="card">Extended Reality (XR)</div>
          <div className="card">Energy Technologies</div>
          <div className="card">Life Sciences</div>
          <div className="card">Quantum & Space Systems</div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section dark">
        <h2>What Students Do at ETI</h2>
        <ul>
          <li>Build real projects used by the college</li>
          <li>Compete in Google, Berkeley & Foothill competitions</li>
          <li>Collaborate across disciplines</li>
          <li>Gain lab, research, and leadership experience</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Access ETI Labs</h2>
        <p>Log in to manage projects, equipment, and lab activity.</p>
        <button className="primary" onClick={() => onNavigate("login")}>
          Continue to Login
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
