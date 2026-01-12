import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { LabProjectRow } from "../lib/supabase";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<LabProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      const { data, error } = await supabase
        .from("lab_projects")
        .select(
          "id, name, brief_description, lab, principal_investigator, advisor, event_rsls, event_berkeley_symposium, event_google_case_comp, event_foothill_innovation_challenge"
        )
        .order("name", { ascending: true });

      if (error) {
        console.error(error);
        setError("Failed to load projects");
      } else {
        setProjects(data ?? []);
      }

      setLoading(false);
    };

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return projects;
    return projects.filter((project) => {
      const haystack = [
        project.name,
        project.brief_description,
        project.lab,
        project.principal_investigator,
        project.advisor,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [projects, query]);

  if (loading) return <p>Loading projects…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="projects-layout">
      <section className="projects-main">
        <div className="projects-search">
          <span aria-hidden="true">🔍</span>
          <input
            placeholder="Search..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          filteredProjects.map((project) => {
            const eventLabels = [
              project.event_rsls ? "RSLS" : null,
              project.event_berkeley_symposium ? "Berkeley Symposium" : null,
              project.event_google_case_comp ? "Google Case Comp" : null,
              project.event_foothill_innovation_challenge ? "Foothill Innovation" : null,
            ].filter(Boolean) as string[];

            return (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <h2>{project.name}</h2>
                  <button type="button" className="project-expand">⋮</button>
                </div>
                {project.brief_description && <p>{project.brief_description}</p>}
                <div className="project-meta">
                  <div>
                    <div className="project-meta-title">Project Lead</div>
                    <div>Lead: {project.principal_investigator}</div>
                    <div>Advisor: {project.advisor || "—"}</div>
                    <div>Lab: {project.lab}</div>
                  </div>
                  <div>
                    <div className="project-meta-title">Event Participation</div>
                    {eventLabels.length > 0 ? (
                      eventLabels.map((label) => <div key={label}>{label}</div>)
                    ) : (
                      <div>None</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      <aside className="projects-events">
        <h2>Events</h2>
        <div className="event-card">
          <h3>Research &amp; Service Leadership Symposium</h3>
          <p>Annual showcase for applied research and community impact.</p>
          <div className="event-meta">
            <span>events.foothill.edu</span>
            <span>September 21, 2025</span>
            <span>Place 123</span>
          </div>
        </div>
        <div className="event-card">
          <h3>Berkeley Symposium</h3>
          <p>Regional symposium featuring emerging tech projects.</p>
          <div className="event-meta">
            <span>events.foothill.edu</span>
            <span>September 21, 2025</span>
            <span>Place 123</span>
          </div>
        </div>
        <div className="event-card">
          <h3>Foothill x Google Case Competition</h3>
          <p>Team case competition focused on product innovation.</p>
          <div className="event-meta">
            <span>events.foothill.edu</span>
            <span>September 21, 2025</span>
            <span>Place 123</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProjectsPage;
