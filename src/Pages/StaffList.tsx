import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { StaffRow } from "../lib/supabase";
import "./StaffList.css";

export default function StaffList() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadStaff = async () => {
      const { data, error } = await supabase
        .from("staff")
        .select(
          "id, first_name, last_name, job_title, role, lab_assigned, community_fws, community_mesa, community_umoja, community_puente, community_veteran, email, telephone, cwid"
        )
        .order("last_name", { ascending: true });

      if (error) {
        console.error(error);
        setError("Failed to load staff");
      } else {
        setStaff(data ?? []);
      }

      setLoading(false);
    };

    loadStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return staff;
    return staff.filter((s) => {
      const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
      const role = s.role?.toLowerCase() ?? "";
      const lab = s.lab_assigned?.toLowerCase() ?? "";
      const email = s.email?.toLowerCase() ?? "";
      return (
        fullName.includes(trimmed) ||
        role.includes(trimmed) ||
        lab.includes(trimmed) ||
        email.includes(trimmed)
      );
    });
  }, [query, staff]);

  if (loading) return <p>Loading staff…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (staff.length === 0) return <p>No staff found.</p>;

  return (
    <div className="staff-page">
      <div className="staff-search">
        <span aria-hidden="true">🔍</span>
        <input
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="staff-list">
        {filteredStaff.map((s) => {
          const communities = [
            s.community_fws ? "FWS" : null,
            s.community_mesa ? "MESA" : null,
            s.community_umoja ? "Umoja" : null,
            s.community_puente ? "Puente" : null,
            s.community_veteran ? "Veteran" : null,
          ].filter(Boolean);

          return (
            <div key={s.id} className="staff-card">
              <div className="staff-avatar" aria-hidden="true" />
              <div className="staff-main">
                <strong>
                  {s.first_name} {s.last_name}
                </strong>
                <div className="staff-sub">
                  {s.job_title}
                  {s.cwid ? `, ${s.cwid}` : ""}
                </div>
                <div className="staff-tags">
                  {communities.length > 0 ? (
                    communities.map((label) => (
                      <span key={label}>{label}</span>
                    ))
                  ) : (
                    <span className="staff-tag-muted">No communities</span>
                  )}
                </div>
              </div>
              <div className="staff-meta">
                <div className="staff-meta-title">Lab</div>
                <div>{s.lab_assigned || "—"}</div>
              </div>
              <div className="staff-meta">
                <div className="staff-meta-title">Contact</div>
                <div>{s.email}</div>
                <div>{s.telephone || "—"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
