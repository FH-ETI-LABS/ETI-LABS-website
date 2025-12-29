import "./ProjectsPage.css";

type ProjectsPageProps = {
  onNavigate: (page: string) => void;
};

const ProjectsPage = ({ onNavigate }: ProjectsPageProps) => {
  return (
    <div className="projects-page">
      <h1>Projects</h1>

      <div className="projects-layout">
        <div className="projects-list">
          <div className="project-card">
            <h3>Project Name</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <div className="project-meta">
              <div>
                <strong>Project Lead:</strong> Joe Shmoe
              </div>
              <div>
                <strong>Advisor:</strong> John Doe Smith
              </div>
              <div>Email: example@student.foothill.edu</div>
              <div>📞 (123) 456-7890</div>
            </div>
          </div>

          <div className="project-card">
            <h3>Project Name</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        <div className="projects-events">
          <h3>Events</h3>

          <div className="event-card">
            <strong>Research & Service Leadership Symposium</strong>
            <div>🌐 www.eventwebsite.com</div>
            <div>📅 September 21, 2025</div>
            <div>📍 Place 123</div>
          </div>

          <div className="event-card">
            <strong>Berkeley Symposium</strong>
            <div>🌐 www.eventwebsite.com</div>
            <div>📅 September 21, 2025</div>
            <div>📍 Place 123</div>
          </div>
        </div>
      </div>

      <button onClick={() => onNavigate("dashboard")}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default ProjectsPage;
