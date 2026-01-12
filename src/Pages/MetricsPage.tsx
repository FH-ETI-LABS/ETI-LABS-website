import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type {
  LabEquipmentRow,
  LabProjectRow,
  LabSignupRow,
  StaffRow,
  StemClubRow,
} from "../lib/supabase";

type MetricsCounts = {
  staff: number;
  clubs: number;
  projects: number;
  equipment: number;
  signups: number;
  labs: number;
  rslsProjects: number;
  berkeleyProjects: number;
  googleProjects: number;
  foothillProjects: number;
};

const MetricsPage = () => {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [clubs, setClubs] = useState<StemClubRow[]>([]);
  const [projects, setProjects] = useState<LabProjectRow[]>([]);
  const [equipment, setEquipment] = useState<LabEquipmentRow[]>([]);
  const [signups, setSignups] = useState<LabSignupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      const [
        staffRes,
        clubsRes,
        projectsRes,
        equipmentRes,
        signupsRes,
      ] = await Promise.all([
        supabase.from("staff").select("id, lab_assigned, community_mesa"),
        supabase.from("stem_clubs").select("id"),
        supabase
          .from("lab_projects")
          .select(
            "id, event_rsls, event_berkeley_symposium, event_google_case_comp, event_foothill_innovation_challenge"
          ),
        supabase.from("lab_equipment").select("id, lab"),
        supabase.from("lab_signups").select("id, lab"),
      ]);

      const firstError =
        staffRes.error ||
        clubsRes.error ||
        projectsRes.error ||
        equipmentRes.error ||
        signupsRes.error;

      if (firstError) {
        console.error(firstError);
        setError("Failed to load metrics");
        setLoading(false);
        return;
      }

      setStaff((staffRes.data ?? []) as StaffRow[]);
      setClubs((clubsRes.data ?? []) as StemClubRow[]);
      setProjects((projectsRes.data ?? []) as LabProjectRow[]);
      setEquipment((equipmentRes.data ?? []) as LabEquipmentRow[]);
      setSignups((signupsRes.data ?? []) as LabSignupRow[]);
      setLoading(false);
    };

    loadMetrics();
  }, []);

  const counts = useMemo<MetricsCounts>(() => {
    const labs = new Set([
      ...staff.map((s) => s.lab_assigned),
      ...equipment.map((e) => e.lab),
      ...signups.map((s) => s.lab),
    ].filter(Boolean));

    return {
      staff: staff.length,
      clubs: clubs.length,
      projects: projects.length,
      equipment: equipment.length,
      signups: signups.length,
      labs: labs.size,
      rslsProjects: projects.filter((p) => p.event_rsls).length,
      berkeleyProjects: projects.filter((p) => p.event_berkeley_symposium).length,
      googleProjects: projects.filter((p) => p.event_google_case_comp).length,
      foothillProjects: projects.filter((p) => p.event_foothill_innovation_challenge).length,
    };
  }, [clubs, equipment, projects, signups, staff]);

  const mesaCount = staff.filter((member) => member.community_mesa).length;
  const mesaPercent = counts.staff ? Math.round((mesaCount / counts.staff) * 100) : 0;

  if (loading) return <p>Loading metrics…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="metrics-layout">
      <section className="metrics-left">
        <div className="metrics-card">
          <h2>Numbers</h2>
          <ul className="metrics-list">
            <li>
              <span>Active Clubs</span>
              <strong>{counts.clubs}</strong>
            </li>
            <li>
              <span>Open Laboratories</span>
              <strong>{counts.labs}</strong>
            </li>
            <li>
              <span>Equipment</span>
              <strong>{counts.equipment}</strong>
            </li>
            <li>
              <span>Daily Signups</span>
              <strong>{counts.signups}</strong>
            </li>
          </ul>
        </div>

        <div className="metrics-card">
          <h2>Particulars</h2>
          <div className="metrics-particulars">
            <div className="metrics-donut">
              <div className="donut-ring" />
              <div>
                <div className="metrics-label">Total Staff</div>
                <div className="metrics-value">{counts.staff}</div>
                <div className="metrics-chip">{mesaPercent}% in MESA</div>
              </div>
            </div>
            <div className="metrics-trend">
              <div className="trend-chart">
                <div className="trend-bar tall" />
                <div className="trend-bar" />
                <div className="trend-bar tallest" />
              </div>
              <div>
                <div className="metrics-label">Lab Visits (Today)</div>
                <div className="metrics-value">{counts.signups}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-right">
        <div className="metrics-card metrics-right-card">
          <div className="metrics-card-header">
            <h2>Projects &amp; Innovation</h2>
            <div className="mini-bars">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="metrics-summary">
            <div>
              <div className="metrics-label">Active Projects</div>
              <strong>{counts.projects}</strong>
            </div>
            <div>
              <div className="metrics-label">Completed Projects</div>
              <strong>—</strong>
            </div>
          </div>
          <div className="metrics-tags">
            <span>{counts.googleProjects} projects in Google Case Competition</span>
            <span>{counts.foothillProjects} projects in Foothill Innovation Challenge</span>
            <span>{counts.berkeleyProjects} projects in Berkeley Symposium</span>
            <span>{counts.rslsProjects} projects in RSLS</span>
            <span>
              {Math.max(
                0,
                counts.projects -
                  counts.googleProjects -
                  counts.foothillProjects -
                  counts.berkeleyProjects -
                  counts.rslsProjects
              )}{" "}
              projects in None
            </span>
          </div>

          <div className="metrics-divider" />

          <div className="metrics-awards">
            <div className="metrics-awards-header">
              <h3>Awards/Honors</h3>
              <strong>—</strong>
            </div>
            <div className="award-card">
              <div className="award-eyebrow">Recent Highlights</div>
              <div className="award-title">Award/Honor Name</div>
              <p>
                Add real awards data here when available.
              </p>
              <div className="award-footer">
                <span>—</span>
                <span>—</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MetricsPage;
