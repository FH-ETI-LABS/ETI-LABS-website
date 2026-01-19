import { useEffect, useMemo, useState } from "react";
import ProjectCard from "../Components/ProjectCard/ProjectCard.tsx";
import CameraCard from "../Components/CameraCard/CameraCard.tsx";
import StemClubsTable from "../Components/StemClubsTable/StemClubsTable.tsx";
import { supabase } from "../lib/supabase";
import type { LabProjectRow, StemClubRow } from "../lib/supabase";
import type { Project } from "../Components/ProjectCard/ProjectCard";
import type { Club } from "../Components/StemClubsTable/StemClubsTable";
import ETILogo from "../assets/images/ETILOGO.png";

import "./DashboardSections.css";

type DashboardSectionsProps = {
  showTitle?: boolean;
  className?: string;
};

export default function DashboardSections({
  showTitle = true,
  className = "",
}: DashboardSectionsProps) {
  const [projects, setProjects] = useState<LabProjectRow[]>([]);
  const [clubs, setClubs] = useState<StemClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuickAccess = async () => {
      const [projectsRes, clubsRes] = await Promise.all([
        supabase
          .from("lab_projects")
          .select(
            "id, name, brief_description, lab, principal_investigator, advisor, completion, est_time, event_rsls, event_berkeley_symposium, event_google_case_comp, event_foothill_innovation_challenge"
          )
          .order("updated_at", { ascending: false })
          .limit(1),
        supabase
          .from("stem_clubs")
          .select(
            "id, name, president, advisor, meeting_time, location, description, discord_link, image_url"
          )
          .order("name", { ascending: true })
          .limit(3),
      ]);

      const firstError = projectsRes.error || clubsRes.error;
      if (firstError) {
        console.error(firstError);
        setError("Failed to load quick access data.");
        setLoading(false);
        return;
      }

      setProjects(projectsRes.data ?? []);
      setClubs(clubsRes.data ?? []);
      setLoading(false);
    };

    loadQuickAccess();
  }, []);

  const featuredProject = useMemo<Project | null>(() => {
    const project = projects[0];
    if (!project) return null;
    return {
      name: project.name ?? "Untitled Project",
      briefDescription: project.brief_description ?? "No description yet.",
      lab: project.lab ?? "—",
      principalInvestigator: project.principal_investigator ?? "—",
      advisor: project.advisor ?? "—",
      completion: typeof project.completion === "number" ? project.completion : 0,
      estTime: project.est_time ?? "TBD",
      events: {
        rsls: !!project.event_rsls,
        berkeleySymposium: !!project.event_berkeley_symposium,
        googleCaseComp: !!project.event_google_case_comp,
        foothillInnovationChallenge: !!project.event_foothill_innovation_challenge,
      },
    };
  }, [projects]);

  const featuredClubs = useMemo<Club[]>(() => {
    return clubs.map((club) => ({
      id: club.id,
      name: club.name ?? "Untitled Club",
      president: club.president ?? "—",
      advisor: club.advisor ?? "—",
      meetingTime: club.meeting_time ?? "TBD",
      location: club.location ?? "TBD",
      description: club.description ?? "No description yet.",
      discordLink: club.discord_link ?? undefined,
      imageUrl: club.image_url ?? ETILogo,
    }));
  }, [clubs]);

  const cameras: { id: string; title: string }[] = [];

  return (
    <div className={`dashboard-sections ${className}`.trim()}>
      {showTitle && <h2 className="section-title">Quick Access</h2>}

      {loading ? (
        <div style={{ padding: 12 }}>Loading quick access…</div>
      ) : error ? (
        <div style={{ padding: 12 }}>{error}</div>
      ) : (
        <div className="dashboard-grid">
          {featuredProject ? (
            <ProjectCard project={featuredProject} />
          ) : (
            <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
              No projects yet.
            </div>
          )}

          {cameras.length > 0 ? (
            cameras.map((camera) => (
              <CameraCard key={camera.id} id={camera.id} title={camera.title} />
            ))
          ) : (
            <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
              No live cameras configured.
            </div>
          )}

          {featuredClubs.length > 0 ? (
            <StemClubsTable clubs={featuredClubs} />
          ) : (
            <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
              No clubs yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
