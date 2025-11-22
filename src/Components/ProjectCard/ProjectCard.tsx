import ProgressBar from "./ProgressBar.tsx";
import "../../Pages/LabProjects.css";

export interface Project {
  name: string;
  briefDescription: string;
  lab: string;
  principalInvestigator: string;
  advisor: string;
  completion: number;
  estTime: string;
  events: {
    rsls: boolean;
    berkeleySymposium: boolean;
    googleCaseComp: boolean;
    foothillInnovationChallenge: boolean;
  };
}

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
 * Updated to show description, advisor, and events.
 */
const ProjectCard = ({ project }: Props) => {
  // Format events for display
  const formatEvents = () => {
    const activeEvents = [];
    if (project.events.rsls) activeEvents.push('RSLS');
    if (project.events.berkeleySymposium) activeEvents.push('Berkeley Symposium');
    if (project.events.googleCaseComp) activeEvents.push('Google Case Comp');
    if (project.events.foothillInnovationChallenge) activeEvents.push('Foothill Innovation Challenge');
    return activeEvents.length > 0 ? activeEvents.join(', ') : 'None';
  };

  return (
    <div className="project-card">
      <h3 className="project-name">{project.name}</h3>
      <p className="project-description">{project.briefDescription}</p>
      <p className="project-lab"><strong>Lab:</strong> {project.lab}</p>
      <p className="project-lead"><strong>Principal Investigator:</strong> {project.principalInvestigator}</p>
      <p className="project-advisor"><strong>Advisor:</strong> {project.advisor}</p>
      <div className="progress-section">
        <p className="progress-label">Completion</p>
        <div className="progress-bar-container">
          <ProgressBar completion={project.completion} />
          <span className="completion-text">{project.completion}%</span>
        </div>
      </div>
      <p className="est-time"><strong>Est. Time:</strong> {project.estTime}</p>
      <p className="project-events"><strong>Events:</strong> {formatEvents()}</p>
    </div>
  );
};

export default ProjectCard;
