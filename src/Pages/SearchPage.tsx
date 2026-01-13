import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import "./SearchPage.css";

type StaffRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  lab_assigned: string | null;
};

type ClubRow = {
  id: number;
  name: string;
  description: string | null;
};

type ProjectRow = {
  id: number;
  name: string;
  brief_description: string | null;
  lab: string | null;
};

type EquipmentRow = {
  id: number;
  resource_name: string;
  resource_description: string | null;
  lab: string | null;
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [staffResults, setStaffResults] = useState<StaffRow[]>([]);
  const [clubResults, setClubResults] = useState<ClubRow[]>([]);
  const [projectResults, setProjectResults] = useState<ProjectRow[]>([]);
  const [equipmentResults, setEquipmentResults] = useState<EquipmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalResults = useMemo(() => {
    return (
      staffResults.length +
      clubResults.length +
      projectResults.length +
      equipmentResults.length
    );
  }, [clubResults.length, equipmentResults.length, projectResults.length, staffResults.length]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setStaffResults([]);
      setClubResults([]);
      setProjectResults([]);
      setEquipmentResults([]);
      setError(null);
      return;
    }

    let cancelled = false;
    const runSearch = async () => {
      setLoading(true);
      setError(null);

      const [staffRes, clubsRes, projectsRes, equipmentRes] = await Promise.all([
        supabase
          .from("staff")
          .select("id, first_name, last_name, email, lab_assigned")
          .or(
            `first_name.ilike.%${trimmed}%,last_name.ilike.%${trimmed}%,email.ilike.%${trimmed}%,lab_assigned.ilike.%${trimmed}%`
          )
          .limit(50),
        supabase
          .from("stem_clubs")
          .select("id, name, description")
          .or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
          .limit(50),
        supabase
          .from("lab_projects")
          .select("id, name, brief_description, lab")
          .or(
            `name.ilike.%${trimmed}%,brief_description.ilike.%${trimmed}%,lab.ilike.%${trimmed}%`
          )
          .limit(50),
        supabase
          .from("lab_equipment")
          .select("id, resource_name, resource_description, lab")
          .or(
            `resource_name.ilike.%${trimmed}%,resource_description.ilike.%${trimmed}%,lab.ilike.%${trimmed}%`
          )
          .limit(50),
      ]);

      const firstError =
        staffRes.error ||
        clubsRes.error ||
        projectsRes.error ||
        equipmentRes.error;

      if (!cancelled) {
        if (firstError) {
          console.error(firstError);
          setError("Search failed. Please try again.");
          setStaffResults([]);
          setClubResults([]);
          setProjectResults([]);
          setEquipmentResults([]);
        } else {
          setStaffResults((staffRes.data ?? []) as StaffRow[]);
          setClubResults((clubsRes.data ?? []) as ClubRow[]);
          setProjectResults((projectsRes.data ?? []) as ProjectRow[]);
          setEquipmentResults((equipmentRes.data ?? []) as EquipmentRow[]);
        }
        setLoading(false);
      }
    };

    runSearch();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-input-row">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          className="search-input"
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading && <p className="search-status">Searching...</p>}

      {!loading && error && <p className="search-status">{error}</p>}

      {!loading && !error && query.trim() !== "" && totalResults === 0 && (
        <p className="search-status">No results</p>
      )}

      {!loading && !error && staffResults.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Staff</div>
          <div className="search-grid">
            {staffResults.map((staff) => (
              <div key={`staff-${staff.id}`} className="search-card">
                <strong>
                  {staff.first_name} {staff.last_name}
                </strong>
                <div>{staff.email}</div>
                <div>{staff.lab_assigned}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && clubResults.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Clubs</div>
          <div className="search-grid">
            {clubResults.map((club) => (
              <div key={`club-${club.id}`} className="search-card">
                <strong>{club.name}</strong>
                <div>{club.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && projectResults.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Projects</div>
          <div className="search-grid">
            {projectResults.map((project) => (
              <div key={`project-${project.id}`} className="search-card">
                <strong>{project.name}</strong>
                <div>{project.brief_description}</div>
                <div>{project.lab}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && equipmentResults.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Equipment</div>
          <div className="search-grid">
            {equipmentResults.map((item) => (
              <div key={`equipment-${item.id}`} className="search-card">
                <strong>{item.resource_name}</strong>
                <div>{item.resource_description}</div>
                <div>{item.lab}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
