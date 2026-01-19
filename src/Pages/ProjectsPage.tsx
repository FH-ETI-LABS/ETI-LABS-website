import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "../lib/supabase";
import type { LabProjectRow } from "../lib/supabase";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<LabProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  type ProjectFormState = {
    name: string;
    brief_description: string;
    lab: string;
    principal_investigator: string;
    advisor: string;
    completion: string;
    est_time: string;
    event_rsls: boolean;
    event_berkeley_symposium: boolean;
    event_google_case_comp: boolean;
    event_foothill_innovation_challenge: boolean;
  };

  const emptyForm: ProjectFormState = {
    name: "",
    brief_description: "",
    lab: "",
    principal_investigator: "",
    advisor: "",
    completion: "",
    est_time: "",
    event_rsls: false,
    event_berkeley_symposium: false,
    event_google_case_comp: false,
    event_foothill_innovation_challenge: false,
  };

  const [formState, setFormState] = useState<ProjectFormState>(emptyForm);

  useEffect(() => {
    const loadProjects = async () => {
      const { data, error } = await supabase
        .from("lab_projects")
        .select(
          "id, name, brief_description, lab, principal_investigator, advisor, completion, est_time, event_rsls, event_berkeley_symposium, event_google_case_comp, event_foothill_innovation_challenge"
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
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user ?? null;
        setAuthUser(user);
        if (user) {
          const { data: profile } = await supabase
            .from("staff")
            .select("role")
            .eq("user_id", user.id)
            .maybeSingle();
          setIsAdmin(profile?.role === "admin");
        }
      } catch {}
    })();
  }, []);

  const reloadProjects = async () => {
    const { data, error: loadError } = await supabase
      .from("lab_projects")
      .select(
        "id, name, brief_description, lab, principal_investigator, advisor, completion, est_time, event_rsls, event_berkeley_symposium, event_google_case_comp, event_foothill_innovation_challenge"
      )
      .order("name", { ascending: true });

    if (loadError) {
      console.error(loadError);
      setError("Failed to load projects");
      return;
    }

    setProjects(data ?? []);
  };

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
        project.est_time,
        project.completion?.toString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [projects, query]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      const checkbox = event.target as HTMLInputElement;
      setFormState((prev) => ({ ...prev, [name]: checkbox.checked }));
      return;
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormError(null);
    setFormState(emptyForm);
  };

  const handleEdit = (project: LabProjectRow) => {
    setEditingId(project.id);
    setFormError(null);
    setFormState({
      name: project.name ?? "",
      brief_description: project.brief_description ?? "",
      lab: project.lab ?? "",
      principal_investigator: project.principal_investigator ?? "",
      advisor: project.advisor ?? "",
      completion:
        typeof project.completion === "number"
          ? String(project.completion)
          : "",
      est_time: project.est_time ?? "",
      event_rsls: project.event_rsls ?? false,
      event_berkeley_symposium: project.event_berkeley_symposium ?? false,
      event_google_case_comp: project.event_google_case_comp ?? false,
      event_foothill_innovation_challenge:
        project.event_foothill_innovation_challenge ?? false,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const requiredFields = [
      formState.name.trim(),
      formState.lab.trim(),
      formState.principal_investigator.trim(),
    ];

    if (requiredFields.some((field) => !field)) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const completionValue =
      formState.completion.trim() === ""
        ? null
        : Number(formState.completion);

    if (
      completionValue !== null &&
      (!Number.isFinite(completionValue) ||
        completionValue < 0 ||
        completionValue > 100)
    ) {
      setFormError("Completion must be a number from 0 to 100.");
      return;
    }

    setSaving(true);

    const payload = {
      name: formState.name.trim(),
      brief_description: formState.brief_description.trim() || null,
      lab: formState.lab.trim(),
      principal_investigator: formState.principal_investigator.trim(),
      advisor: formState.advisor.trim() || null,
      completion: completionValue,
      est_time: formState.est_time.trim() || null,
      event_rsls: formState.event_rsls,
      event_berkeley_symposium: formState.event_berkeley_symposium,
      event_google_case_comp: formState.event_google_case_comp,
      event_foothill_innovation_challenge:
        formState.event_foothill_innovation_challenge,
    };

    const { error: saveError } = editingId
      ? await supabase.from("lab_projects").update(payload).eq("id", editingId)
      : await supabase.from("lab_projects").insert(payload);

    if (saveError) {
      console.error(saveError);
      setFormError(saveError.message || "Failed to save project.");
      setSaving(false);
      return;
    }

    await reloadProjects();
    setSaving(false);
    resetForm();
  };

  const handleDelete = async (project: LabProjectRow) => {
    const confirmed = window.confirm(
      `Delete ${project.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("lab_projects")
      .delete()
      .eq("id", project.id);

    if (deleteError) {
      console.error(deleteError);
      setFormError(deleteError.message || "Delete failed. Check RLS policies.");
      return;
    }

    await reloadProjects();
  };

  if (loading) return <p>Loading projects…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="projects-layout">
      <section className="projects-main">
        {isAdmin ? (
          <form className="projects-form" onSubmit={handleSubmit}>
            <div className="projects-form-header">
              <div>
                <strong>{editingId ? "Edit project" : "Add a project"}</strong>
                <div className="projects-form-subtitle">
                  {editingId
                    ? "Update project details and save."
                    : "Share a new lab project with the team."}
                </div>
              </div>
              {editingId && (
                <button
                  className="projects-form-secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel edit
                </button>
              )}
            </div>

            <div className="projects-form-grid">
              <label>
                Project name*
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Lab*
                <input
                  name="lab"
                  value={formState.lab}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Project lead*
                <input
                  name="principal_investigator"
                  value={formState.principal_investigator}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Advisor
                <input
                  name="advisor"
                  value={formState.advisor}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Completion (%)
                <input
                  name="completion"
                  type="number"
                  min="0"
                  max="100"
                  value={formState.completion}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Estimated time
                <input
                  name="est_time"
                  value={formState.est_time}
                  onChange={handleInputChange}
                />
              </label>
              <label className="projects-form-description">
                Brief description
                <textarea
                  name="brief_description"
                  rows={3}
                  value={formState.brief_description}
                  onChange={handleInputChange}
                />
              </label>
              <div className="projects-form-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    name="event_rsls"
                    checked={formState.event_rsls}
                    onChange={handleInputChange}
                  />
                  RSLS
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="event_berkeley_symposium"
                    checked={formState.event_berkeley_symposium}
                    onChange={handleInputChange}
                  />
                  Berkeley Symposium
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="event_google_case_comp"
                    checked={formState.event_google_case_comp}
                    onChange={handleInputChange}
                  />
                  Google Case Competition
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="event_foothill_innovation_challenge"
                    checked={formState.event_foothill_innovation_challenge}
                    onChange={handleInputChange}
                  />
                  Foothill Innovation Challenge
                </label>
              </div>
            </div>

            {formError && (
              <div className="projects-form-error">{formError}</div>
            )}

            <div className="projects-form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add project"}
              </button>
            </div>
        </form>
      ) : (
        <div className="projects-auth-hint">
          {authUser
            ? "Admin access required to add or edit lab projects."
            : "Sign in as an admin to add or edit lab projects."}
        </div>
      )}

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
                  {isAdmin && (
                    <div className="project-card-actions">
                      <button type="button" onClick={() => handleEdit(project)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="project-card-danger"
                        onClick={() => handleDelete(project)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {project.brief_description && <p>{project.brief_description}</p>}
                <div className="project-meta">
                  <div>
                    <div className="project-meta-title">Project Lead</div>
                    <div>Lead: {project.principal_investigator}</div>
                    <div>Advisor: {project.advisor || "—"}</div>
                    <div>Lab: {project.lab}</div>
                    {typeof project.completion === "number" && (
                      <div>Completion: {project.completion}%</div>
                    )}
                    {project.est_time && <div>Est. time: {project.est_time}</div>}
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
