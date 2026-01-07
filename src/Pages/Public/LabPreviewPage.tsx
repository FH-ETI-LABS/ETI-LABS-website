import { useParams, Link } from "react-router-dom";

const LAB_INFO: Record<string, { title: string; desc: string }> = {
  ai: {
    title: "Artificial Intelligence",
    desc: "Explore modern AI, ML, and applied projects.",
  },
  cybersecurity: {
    title: "Cybersecurity",
    desc: "Learn defense, ethical hacking, and security fundamentals.",
  },
  xr: {
    title: "Extended Reality (XR)",
    desc: "Build VR/AR experiences and immersive tech demos.",
  },
  energy: {
    title: "Energy Technologies",
    desc: "Explore clean energy systems and applied innovation.",
  },
  lifesciences: {
    title: "Life Sciences",
    desc: "Hands-on projects bridging tech + biology/health.",
  },
  quantum: {
    title: "Quantum & Space Systems",
    desc: "Intro-level exploration of quantum computing and space tech.",
  },
};

export function LabPreviewPage() {
  const { labId } = useParams();

  const lab = (labId && LAB_INFO[labId]) || null;

  if (!lab) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Lab not found</h1>
        <p>That lab page doesn’t exist yet.</p>
        <Link to="/">← Back to ETI</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <Link to="/">← Back to ETI</Link>

      <h1 style={{ marginTop: 16 }}>{lab.title}</h1>
      <p style={{ maxWidth: 700, marginTop: 12 }}>{lab.desc}</p>

      <div style={{ marginTop: 28 }}>
        <h2>What students do</h2>
        <ul>
          <li>Build real projects</li>
          <li>Work with mentors</li>
          <li>Join competitions & showcases</li>
        </ul>
      </div>

      <div style={{ marginTop: 28 }}>
        <Link to="/login">Sign in to access ETI tools →</Link>
      </div>
    </div>
  );
}

export default LabPreviewPage;
