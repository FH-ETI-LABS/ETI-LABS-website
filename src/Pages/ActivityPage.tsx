import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { LabSignupRow } from "../lib/supabase";

const ActivityPage = () => {
  const [entries, setEntries] = useState<LabSignupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadSignups = async () => {
      const { data, error } = await supabase
        .from("lab_signups")
        .select(
          "id, time_signed_in, time_signed_out, first_name, last_name, lab, cwid, date"
        )
        .order("date", { ascending: false });

      if (error) {
        console.error(error);
        setError("Failed to load activity");
      } else {
        setEntries(data ?? []);
      }

      setLoading(false);
    };

    loadSignups();
  }, []);

  const labOptions = useMemo(() => {
    return Array.from(new Set(entries.map((entry) => entry.lab).filter(Boolean)));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const haystack = [
        entry.first_name,
        entry.last_name,
        entry.lab,
        entry.cwid?.toString(),
        entry.date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !trimmed || haystack.includes(trimmed);
      const matchesDate = !selectedDate || entry.date === selectedDate;
      const matchesLab = !selectedLab || entry.lab === selectedLab;
      return matchesQuery && matchesDate && matchesLab;
    });
  }, [entries, query, selectedDate, selectedLab]);

  if (loading) return <p>Loading activity…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="activity-panel">
      <div className="activity-toolbar">
        <div className="activity-search">
          <span aria-hidden="true">🔍</span>
          <input
            placeholder="Search Name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="activity-filters">
          <button type="button" onClick={() => setShowFilters((prev) => !prev)}>
            Filter Date
          </button>
          <button type="button" onClick={() => setShowFilters((prev) => !prev)}>
            Filter Lab
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="activity-filter-panel">
          <label>
            <span>Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>
          <label>
            <span>Lab</span>
            <select
              value={selectedLab}
              onChange={(event) => setSelectedLab(event.target.value)}
            >
              <option value="">All</option>
              {labOptions.map((lab) => (
                <option key={lab} value={lab}>
                  {lab}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setSelectedDate("");
              setSelectedLab("");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="activity-table">
        <div className="activity-row activity-header">
          <div>Name</div>
          <div>CWID</div>
          <div>Time In</div>
          <div>Time Out</div>
          <div>Date</div>
          <div>Lab</div>
        </div>
        {filteredEntries.length === 0 ? (
          <div className="activity-row">
            <div>No activity found.</div>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="activity-row">
              <div>
                {entry.first_name} {entry.last_name}
              </div>
              <div>{entry.cwid}</div>
              <div>{entry.time_signed_in}</div>
              <div>{entry.time_signed_out || "—"}</div>
              <div>{entry.date}</div>
              <div>{entry.lab}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
