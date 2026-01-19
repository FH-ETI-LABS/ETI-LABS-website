import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "../lib/supabase";
import type { StemClubRow } from "../lib/supabase";

type ClubFormState = {
  name: string;
  president: string;
  advisor: string;
  meeting_time: string;
  location: string;
  description: string;
  discord_link: string;
  image_url: string;
};

const emptyClubForm: ClubFormState = {
  name: "",
  president: "",
  advisor: "",
  meeting_time: "",
  location: "",
  description: "",
  discord_link: "",
  image_url: "",
};

const ClubsPage = () => {
  const [clubs, setClubs] = useState<StemClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formState, setFormState] = useState<ClubFormState>(emptyClubForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  const reloadClubs = async () => {
    const { data, error: loadError } = await supabase
      .from("stem_clubs")
      .select(
        "id, name, president, advisor, meeting_time, location, description, discord_link, image_url"
      )
      .order("name", { ascending: true });

    if (loadError) {
      console.error(loadError);
      setError("Failed to load clubs");
      return;
    }

    setClubs(data ?? []);
  };

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

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormError(null);
    setFormState(emptyClubForm);
  };

  const handleEdit = (club: StemClubRow) => {
    setEditingId(club.id);
    setFormError(null);
    setFormState({
      name: club.name,
      president: club.president,
      advisor: club.advisor,
      meeting_time: club.meeting_time ?? "",
      location: club.location ?? "",
      description: club.description ?? "",
      discord_link: club.discord_link ?? "",
      image_url: club.image_url ?? "",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const requiredFields = [
      formState.name.trim(),
      formState.president.trim(),
      formState.advisor.trim(),
    ];

    if (requiredFields.some((field) => !field)) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    const payload = {
      name: formState.name.trim(),
      president: formState.president.trim(),
      advisor: formState.advisor.trim(),
      meeting_time: formState.meeting_time.trim() || null,
      location: formState.location.trim() || null,
      description: formState.description.trim() || null,
      discord_link: formState.discord_link.trim() || null,
      image_url: formState.image_url.trim() || null,
    };

    const { error: saveError } = editingId
      ? await supabase.from("stem_clubs").update(payload).eq("id", editingId)
      : await supabase.from("stem_clubs").insert(payload);

    if (saveError) {
      console.error(saveError);
      setFormError(saveError.message || "Failed to save club.");
      setSaving(false);
      return;
    }

    await reloadClubs();
    setSaving(false);
    resetForm();
  };

  const handleDelete = async (club: StemClubRow) => {
    const confirmed = window.confirm(
      `Delete ${club.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("stem_clubs")
      .delete()
      .eq("id", club.id);

    if (deleteError) {
      console.error(deleteError);
      setFormError(deleteError.message || "Delete failed. Check RLS policies.");
      return;
    }

    setClubs((prev) => prev.filter((item) => item.id !== club.id));
  };

  if (loading) return <p>Loading clubs…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="clubs-panel">
      {isAdmin ? (
        <form className="clubs-form" onSubmit={handleSubmit}>
          <div className="clubs-form-header">
            <div>
              <strong>{editingId ? "Edit club" : "Add a club"}</strong>
              <div className="clubs-form-subtitle">
                {editingId
                  ? "Update club details and save."
                  : "Share a new STEM club with the community."}
              </div>
            </div>
            {editingId && (
              <button
                className="clubs-form-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="clubs-form-grid">
            <label>
              Club name*
              <input
                name="name"
                value={formState.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              President*
              <input
                name="president"
                value={formState.president}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Advisor*
              <input
                name="advisor"
                value={formState.advisor}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Meeting time
              <input
                name="meeting_time"
                value={formState.meeting_time}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Location
              <input
                name="location"
                value={formState.location}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Discord link
              <input
                name="discord_link"
                value={formState.discord_link}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Image URL
              <input
                name="image_url"
                value={formState.image_url}
                onChange={handleInputChange}
              />
            </label>
            <label className="clubs-form-description">
              Description
              <textarea
                name="description"
                rows={3}
                value={formState.description}
                onChange={handleInputChange}
              />
            </label>
          </div>

          {formError && <div className="clubs-form-error">{formError}</div>}

          <div className="clubs-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add club"}
            </button>
          </div>
        </form>
      ) : (
        <div className="clubs-auth-hint">
          {authUser
            ? "Admin access required to add or edit STEM clubs."
            : "Sign in as an admin to add or edit STEM clubs."}
        </div>
      )}

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
                {isAdmin && (
                  <div className="club-card-actions">
                    <button type="button" onClick={() => handleEdit(club)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="club-card-danger"
                      onClick={() => handleDelete(club)}
                    >
                      Delete
                    </button>
                  </div>
                )}
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
