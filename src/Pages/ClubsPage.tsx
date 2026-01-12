import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { StemClubRow } from "../lib/supabase";

const ClubsPage = () => {
  const [clubs, setClubs] = useState<StemClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadClubs = async () => {
      const { data, error } = await supabase
        .from("stem_clubs")
        .select(
          "id, name, president, advisor, meeting_time, location, description, discord_link"
        )
        .order("name", { ascending: true });

      if (error) {
        console.error(error);
        setError("Failed to load clubs");
      } else {
        setClubs(data ?? []);
      }

      setLoading(false);
    };

    loadClubs();
  }, []);

  const filteredClubs = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return clubs;
    return clubs.filter((club) => {
      const haystack = [
        club.name,
        club.president,
        club.advisor,
        club.meeting_time,
        club.location,
        club.description,
        club.discord_link,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [clubs, query]);

  if (loading) return <p>Loading clubs…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="clubs-panel">
      <div className="clubs-search">
        <span aria-hidden="true">🔍</span>
        <input
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filteredClubs.length === 0 ? (
        <p>No clubs found.</p>
      ) : (
        <div className="clubs-grid">
          {filteredClubs.map((club) => (
            <div key={club.id} className="club-card">
              <div className="club-card-header">
                <strong>{club.name}</strong>
              </div>
              <div className="club-meta">
                <span>President: {club.president}</span>
                <span>Advisor: {club.advisor}</span>
              </div>
              {club.description && <p>{club.description}</p>}
              <div className="club-links">
                {club.discord_link && (
                  <span className="club-link-item">
                    🔗 {club.discord_link}
                  </span>
                )}
                {club.meeting_time && (
                  <span className="club-link-item">
                    🕒 {club.meeting_time}
                  </span>
                )}
                {club.location && (
                  <span className="club-link-item">
                    📍 {club.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
