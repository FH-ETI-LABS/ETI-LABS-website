import { useNavigate } from "react-router-dom";
import "./landingpage.css";
import FoothillLogo from "../../assets/images/Foothill_College_logo.svg.png";
import ETILogo from "../../assets/images/ETILOGO.png";

const LABS = [
  { id: "ai", title: "Artificial Intelligence", tag: "ML, LLMs & Robotics", color: "#8B5CF6" },
  { id: "quantum", title: "Quantum Computing", tag: "Qubits & Algorithms", color: "#06B6D4" },
  { id: "space", title: "Space Sciences", tag: "AstroTech & Systems", color: "#F97316" },
  { id: "xr", title: "XR/VR Systems", tag: "Immersive Learning", color: "#EF4444" },
  { id: "energy", title: "Energy Technologies", tag: "Sustainable Systems", color: "#10B981" },
  { id: "lifesciences", title: "Life Sciences", tag: "Bio & Health Tech", color: "#F59E0B" },
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
        <section className="hero-section">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-copy">
                <span className="section-label">Institutional Portal</span>
                <h1 className="hero-title">Emerging Technologies<br/>Institute</h1>
                <p className="hero-sub">The interdisciplinary innovation hub at Foothill College. Bridging the gap between academic theory and industrial application across AI, Quantum, and Space systems.</p>
                <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                  <button className="btn-primary sharp-edge" onClick={() => navigate('/create-account')}>Apply for Fellowship</button>
                  <button className="btn-secondary sharp-edge" onClick={() => window.open('/principia','_blank')}>Principia Magazine</button>
                </div>
              </div>

              <div className="hero-visual" aria-hidden="true" />
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
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#374151' }}>{lab.tag}</div>
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
