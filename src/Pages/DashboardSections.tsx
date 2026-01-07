import ProjectCard from "../Components/ProjectCard/ProjectCard.tsx";
import CameraCard from "../Components/CameraCard/CameraCard.tsx";
import StemClubsTable from "../Components/StemClubsTable/StemClubsTable.tsx";
import { sampleProject, sampleCameras, sampleClubs } from "../data/sampleData";

import "./DashboardSections.css";

export default function DashboardSections() {
  return (
    <div className="dashboard-sections">
      <h2 className="section-title">Quick Access</h2>

      <div className="dashboard-grid">
        {/* Provide minimal placeholder props so components compile under strict typings */}
        <ProjectCard project={sampleProject} />
        {sampleCameras.map((c) => (
          <CameraCard key={c.id} id={c.id} title={c.title} />
        ))}
        <StemClubsTable clubs={sampleClubs} />
      </div>
    </div>
  );
}
