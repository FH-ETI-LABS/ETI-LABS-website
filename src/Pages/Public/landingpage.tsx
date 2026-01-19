import { useNavigate } from "react-router-dom";
import "./landingpage.css";
import FoothillLogo from "../../assets/images/Foothill_College_logo.svg.png";
import ETILogo from "../../assets/images/ETILOGO.png";

const LABS = [
  { id: "ai", title: "Artificial Intelligence", tag: "ML, LLMs & Robotics", color: "#0EA5A4" },
  { id: "quantum", title: "Quantum Computing", tag: "Qubits & Algorithms", color: "#F97316" },
  { id: "space", title: "Space Sciences", tag: "AstroTech & Systems", color: "#1D4ED8" },
  { id: "xr", title: "XR/VR Systems", tag: "Immersive Learning", color: "#DC2626" },
  { id: "energy", title: "Energy Technologies", tag: "Sustainable Systems", color: "#059669" },
  { id: "lifesciences", title: "Life Sciences", tag: "Bio & Health Tech", color: "#CA8A04" },
];

type LandingPageProps = {
  onNavigate?: (page: string) => void;
};

export default function LandingPage(_: LandingPageProps) {
  const navigate = useNavigate();

  const getIcon = (id: string) => {
    // Simple inline SVG icons per lab id
    switch (id) {
      case 'ai':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <path d="M8 12h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 8v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'quantum':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4c4 0 8 4 8 8s-4 8-8 8-8-4-8-8 4-8 8-8z" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <path d="M7 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'space':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </svg>
        );
      case 'xr':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="16" height="12" rx="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </svg>
        );
      case 'energy':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </svg>
        );
    }
  };

  return (
    <div className="landing-container sharp-edge">
      <header className="top-nav" role="banner">
        <div className="container header-inner">
          <div className="brand">
            <img src={FoothillLogo} alt="Foothill College" className="brand-logo foothill" />
            <img src={ETILogo} alt="ETI" className="brand-logo eti" />
          </div>

          <div className="right-group">
            <nav className="top-actions" aria-label="Main navigation">
              <a className="top-link" href="#overview" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Overview</a>
              <button className="top-link" onClick={() => navigate('/labs')}>Labs</button>
              <a className="top-link" href="/resources">Resources</a>
              <button className="btn-primary sharp-edge" onClick={() => navigate('/login')}>Sign In</button>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section" id="overview">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-copy">
                <span className="section-label">Institutional Portal</span>
                <h1 className="hero-title">Emerging Technologies<br/>Institute</h1>
                <p className="hero-sub">
                  The interdisciplinary innovation hub at Foothill College. We turn
                  academic curiosity into deployable systems across AI, Quantum, Space,
                  and energy tech.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary sharp-edge" onClick={() => navigate('/create-account')}>Apply for Fellowship</button>
                  <button className="btn-secondary sharp-edge" onClick={() => window.open('/principia','_blank')}>Principia Magazine</button>
                </div>
                <div className="hero-stats">
                  <div>
                    <div className="hero-stat-value">6</div>
                    <div className="hero-stat-label">Active Labs</div>
                  </div>
                  <div>
                    <div className="hero-stat-value">120+</div>
                    <div className="hero-stat-label">Student Researchers</div>
                  </div>
                  <div>
                    <div className="hero-stat-value">18</div>
                    <div className="hero-stat-label">Industry Partners</div>
                  </div>
                </div>
              </div>

              <div className="hero-visual" aria-hidden="true">
                <div className="hero-card hero-card-main">
                  <div className="hero-card-label">Current Focus</div>
                  <div className="hero-card-title">Applied AI + Edge Systems</div>
                  <div className="hero-card-meta">Rapid prototyping · Safety reviews · Field testing</div>
                </div>
                <div className="hero-card hero-card-secondary">
                  <div className="hero-card-label">Live Pipeline</div>
                  <div className="hero-card-title">Quantum Lab Cohort</div>
                  <div className="hero-card-meta">8 teams · 12-week sprint</div>
                </div>
                <div className="hero-signal">
                  <span>Signal</span>
                  <strong>ETI-OPS</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="programs-section">
          <div className="container">
            <span className="section-label">Programs</span>
            <h2 className="section-title">Build, Ship, Collaborate</h2>
            <div className="program-grid">
              <div className="program-card">
                <div className="program-title">Research Fellowships</div>
                <p>Mentored tracks for undergrads to lead lab experiments and publish outcomes.</p>
                <button className="ghost-button" onClick={() => navigate('/create-account')}>Apply now</button>
              </div>
              <div className="program-card">
                <div className="program-title">Industry Collaborations</div>
                <p>Applied projects with real-world constraints and shared IP governance.</p>
                <button className="ghost-button" onClick={() => navigate('/resources')}>View opportunities</button>
              </div>
              <div className="program-card">
                <div className="program-title">Student Startups</div>
                <p>Prototype funding, venture mentorship, and accelerator-ready validation.</p>
                <button className="ghost-button" onClick={() => navigate('/labs')}>Join a lab</button>
              </div>
            </div>
          </div>
        </section>

        <section className="labs-section">
          <div className="container">
            <span className="section-label">Research Labs</span>
            <h2 className="section-title">Explore Our Systems</h2>

            <div className="lab-grid" aria-label="Labs">
              {LABS.map((lab) => (
                <div key={lab.id} className={`lab-tile`} onClick={() => navigate(`/labs/${lab.id}`)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/labs/${lab.id}`); }}>
                  <div className="lab-header">
                    <div className="lab-icon lab-accent" style={{ background: lab.color }}>{getIcon(lab.id)}</div>
                    <div>
                      <div className="lab-tagline">{lab.tag}</div>
                      <h3 className="lab-title">{lab.title}</h3>
                    </div>
                  </div>
                  <p className="lab-desc">{lab.tag} — projects, equipment, and mentorship available.</p>
                  <div className="lab-link">Enter Lab</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container contact-inner">
            <span className="section-label">Partner with ETI</span>
            <h2 className="contact-title">Request Access or Partnership</h2>
            <p style={{ color: '#6b7280', marginBottom: 18 }}>Interested in collaborating, joining as a fellow, or requesting lab access? Drop us a short message and we'll get back to you.</p>
            <form action="https://formspree.io/f/kalaitzidiskonstantin@fhda.edu" method="POST" className="contact-form">
              <div className="field"><label>First Name</label><input name="firstName" required/></div>
              <div className="field"><label>Last Name</label><input name="lastName" required/></div>
              <div className="field full"><label>Institutional Email</label><input name="email" type="email" required/></div>
              <div className="field full"><label>Inquiry Details</label><textarea name="message" rows={2} required/></div>
              <button type="submit" className="btn-primary sharp-edge">Request Partnership</button>
            </form>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="container footer-inner">
            <span className="footer-copy">© 2026 Foothill College ETI</span>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">STEM Division</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
