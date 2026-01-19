import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "../lib/supabase";
import type { LabSignupRow } from "../lib/supabase";
import Toast from "../Components/Toast/Toast";
import "./CrudForms.css";

const ActivityPage = () => {
  const [entries, setEntries] = useState<LabSignupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; tone?: "success" | "error" | "info" } | null>(null);

  type SignupFormState = {
    first_name: string;
    last_name: string;
    lab: string;
    cwid: string;
    date: string;
    time_signed_in: string;
    time_signed_out: string;
  };

  const emptyForm: SignupFormState = {
    first_name: "",
    last_name: "",
    lab: "",
    cwid: "",
    date: "",
    time_signed_in: "",
    time_signed_out: "",
  };

  const [formState, setFormState] = useState<SignupFormState>(emptyForm);

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

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const reloadEntries = async () => {
    const { data, error: loadError } = await supabase
      .from("lab_signups")
      .select(
        "id, time_signed_in, time_signed_out, first_name, last_name, lab, cwid, date"
      )
      .order("date", { ascending: false });

    if (loadError) {
      console.error(loadError);
      setError("Failed to load activity");
      return;
    }

    setEntries(data ?? []);
  };

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

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormError(null);
    setFormState(emptyForm);
  };

  const handleEdit = (entry: LabSignupRow) => {
    setEditingId(entry.id);
    setFormError(null);
    setFormState({
      first_name: entry.first_name ?? "",
      last_name: entry.last_name ?? "",
      lab: entry.lab ?? "",
      cwid: entry.cwid ? String(entry.cwid) : "",
      date: entry.date ?? "",
      time_signed_in: entry.time_signed_in ?? "",
      time_signed_out: entry.time_signed_out ?? "",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const requiredFields = [
      formState.first_name.trim(),
      formState.last_name.trim(),
      formState.lab.trim(),
      formState.cwid.trim(),
      formState.date.trim(),
      formState.time_signed_in.trim(),
    ];

    if (requiredFields.some((field) => !field)) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const cwidValue = Number(formState.cwid);
    if (!Number.isFinite(cwidValue)) {
      setFormError("CWID must be a number.");
      return;
    }

    setSaving(true);

    const payload = {
      first_name: formState.first_name.trim(),
      last_name: formState.last_name.trim(),
      lab: formState.lab.trim(),
      cwid: cwidValue,
      date: formState.date,
      time_signed_in: formState.time_signed_in.trim(),
      time_signed_out: formState.time_signed_out.trim() || null,
    };

    const { error: saveError } = editingId
      ? await supabase.from("lab_signups").update(payload).eq("id", editingId)
      : await supabase.from("lab_signups").insert(payload);

    if (saveError) {
      console.error(saveError);
      setFormError(saveError.message || "Failed to save signup.");
      setSaving(false);
      return;
    }

    await reloadEntries();
    setSaving(false);
    resetForm();
    setToast({
      message: editingId ? "Signup updated." : "Signup added.",
      tone: "success",
    });
  };

  const handleDelete = async (entry: LabSignupRow) => {
    const confirmed = window.confirm(
      `Delete entry for ${entry.first_name} ${entry.last_name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("lab_signups")
      .delete()
      .eq("id", entry.id);

    if (deleteError) {
      console.error(deleteError);
      setFormError(deleteError.message || "Delete failed. Check RLS policies.");
      return;
    }

    await reloadEntries();
    setToast({ message: "Signup deleted.", tone: "success" });
  };

  if (loading) return <p>Loading activity…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="activity-panel">
      {toast && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      )}
      {isAdmin ? (
        <form className="activity-form" onSubmit={handleSubmit}>
          <div className="activity-form-header">
            <div>
              <strong>{editingId ? "Edit signup" : "Add a signup"}</strong>
              <div className="activity-form-subtitle">
                {editingId
                  ? "Update lab visit details and save."
                  : "Log a lab sign-in or sign-out."}
              </div>
            </div>
            {editingId && (
              <button
                className="activity-form-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="activity-form-grid">
            <label>
              First name*
              <input
                name="first_name"
                value={formState.first_name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Last name*
              <input
                name="last_name"
                value={formState.last_name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              CWID*
              <input
                name="cwid"
                value={formState.cwid}
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
              Date*
              <input
                type="date"
                name="date"
                value={formState.date}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Time in*
              <input
                name="time_signed_in"
                placeholder="09:00 AM"
                value={formState.time_signed_in}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Time out
              <input
                name="time_signed_out"
                placeholder="11:00 AM"
                value={formState.time_signed_out}
                onChange={handleInputChange}
              />
            </label>
          </div>

          {formError && <div className="activity-form-error">{formError}</div>}

          <div className="activity-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add signup"}
            </button>
          </div>
        </form>
      ) : (
        <div className="activity-auth-hint">
          {authUser
            ? "Admin access required to add, edit, or delete lab activity."
            : "Sign in as an admin to add, edit, or delete lab activity."}
        </div>
      )}

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
          <div className="empty-state">No activity found.</div>
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
              <div className="activity-lab-cell">
                {entry.lab}
                {isAdmin && (
                  <span className="activity-row-actions">
                    <button type="button" onClick={() => handleEdit(entry)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="activity-row-danger"
                      onClick={() => handleDelete(entry)}
                    >
                      Delete
                    </button>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
