import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./SearchPage.css";

type StaffRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  lab_assigned: string | null;
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const runSearch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("staff")
        .select("id, first_name, last_name, email, lab_assigned")
        .or(
          `first_name.ilike.%${trimmed}%,last_name.ilike.%${trimmed}%,email.ilike.%${trimmed}%,lab_assigned.ilike.%${trimmed}%`
        )
        .limit(50);

      if (!cancelled) {
        setResults(error ? [] : data ?? []);
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
          placeholder="Search staff..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading && <p className="search-status">Searching...</p>}

      {!loading && query.trim() !== "" && results.length === 0 && (
        <p className="search-status">No results</p>
      )}

      {!loading && results.length > 0 && (
        <div className="search-grid">
          {results.map((staff) => (
            <div key={staff.id} className="search-card">
              <strong>
                {staff.first_name} {staff.last_name}
              </strong>
              <div>{staff.email}</div>
              <div>{staff.lab_assigned}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
