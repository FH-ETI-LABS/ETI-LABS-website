import type { Project } from "../../Pages/LabProjectsPage.tsx";
import ProgressBar from "./ProgressBar.tsx";
import "../../Pages/LabProjects.css";

/**
 * @interface Props
 * @property {Project} project - The project data object to be displayed in the card.
 */
interface Props {
  project: Project;
}

/**
 * ProjectCard Component
 * A card component that visually represents a single lab project.
 * It displays the project's name, lab, lead, and progress.
 */
const ProjectCard = ({ project }: Props) => {
  return (
    <div className="project-card">
      <h3 className="project-name">{project.name}</h3>
      <p className="project-lab">Lab: {project.lab}</p>
      <p className="project-lead">Project Lead: {project.projectLead}</p>
      <div className="progress-section">
        <p className="progress-label">Completion</p>
        <div className="progress-bar-container">
          <ProgressBar completion={project.completion} />
          <span className="completion-text">{project.completion}%</span>
        </div>
      </div>
      <p className="est-time">Est. Time: {project.estTime}</p>
    </div>
  );
};

export default ProjectCard;
