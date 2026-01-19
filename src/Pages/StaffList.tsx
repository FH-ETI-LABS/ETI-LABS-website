import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "../lib/supabase";
import type { StaffRow } from "../lib/supabase";
import "./StaffList.css";

type StaffFormState = {
  first_name: string;
  last_name: string;
  job_title: string;
  role: string;
  lab_assigned: string;
  email: string;
  telephone: string;
  cwid: string;
  community_fws: boolean;
  community_mesa: boolean;
  community_umoja: boolean;
  community_puente: boolean;
  community_veteran: boolean;
};

const emptyForm: StaffFormState = {
  first_name: "",
  last_name: "",
  job_title: "",
  role: "",
  lab_assigned: "",
  email: "",
  telephone: "",
  cwid: "",
  community_fws: false,
  community_mesa: false,
  community_umoja: false,
  community_puente: false,
  community_veteran: false,
};

export default function StaffList() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [formState, setFormState] = useState<StaffFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadStaff = async () => {
      const { data, error: loadError } = await supabase
        .from("staff")
        .select(
          "id, first_name, last_name, job_title, role, lab_assigned, community_fws, community_mesa, community_umoja, community_puente, community_veteran, email, telephone, cwid"
        )
        .order("last_name", { ascending: true });

      if (loadError) {
        console.error(loadError);
        setError("Failed to load staff");
      } else {
        setStaff(data ?? []);
      }

      setLoading(false);
    };

    loadStaff();
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) return;
        const { data: profile } = await supabase
          .from("staff")
          .select("role")
          .eq("user_id", auth.user.id)
          .maybeSingle();
        setIsAdmin(profile?.role === "admin");
      } catch {}
    })();
  }, []);

  const reloadStaff = async () => {
    const { data, error: loadError } = await supabase
      .from("staff")
      .select(
        "id, first_name, last_name, job_title, role, lab_assigned, community_fws, community_mesa, community_umoja, community_puente, community_veteran, email, telephone, cwid"
      )
      .order("last_name", { ascending: true });

    if (loadError) {
      console.error(loadError);
      setError("Failed to load staff");
      return;
    }

    setStaff(data ?? []);
  };

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

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      const checkbox = event.target as HTMLInputElement;
      setFormState((prev) => ({ ...prev, [name]: checkbox.checked }));
      return;
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (member: StaffRow) => {
    setEditingId(member.id);
    setFormError(null);
    setFormState({
      first_name: member.first_name,
      last_name: member.last_name,
      job_title: member.job_title,
      role: member.role,
      lab_assigned: member.lab_assigned,
      email: member.email,
      telephone: member.telephone ?? "",
      cwid: member.cwid ? String(member.cwid) : "",
      community_fws: member.community_fws,
      community_mesa: member.community_mesa,
      community_umoja: member.community_umoja,
      community_puente: member.community_puente,
      community_veteran: member.community_veteran,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormError(null);
    setFormState(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const requiredFields = [
      formState.first_name.trim(),
      formState.last_name.trim(),
      formState.job_title.trim(),
      formState.role.trim(),
      formState.lab_assigned.trim(),
      formState.email.trim(),
      formState.cwid.trim(),
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
      job_title: formState.job_title.trim(),
      role: formState.role.trim(),
      lab_assigned: formState.lab_assigned.trim(),
      email: formState.email.trim(),
      telephone: formState.telephone.trim() || null,
      cwid: cwidValue,
      community_fws: formState.community_fws,
      community_mesa: formState.community_mesa,
      community_umoja: formState.community_umoja,
      community_puente: formState.community_puente,
      community_veteran: formState.community_veteran,
    };

    const { error: saveError } = editingId
      ? await supabase.from("staff").update(payload).eq("id", editingId)
      : await supabase.from("staff").insert(payload);

    if (saveError) {
      console.error(saveError);
      setFormError(saveError.message || "Failed to save staff profile.");
      setSaving(false);
      return;
    }

    await reloadStaff();
    setSaving(false);
    resetForm();
  };

  const handleDelete = async (member: StaffRow) => {
    const confirmed = window.confirm(
      `Delete ${member.first_name} ${member.last_name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("staff")
      .delete()
      .eq("id", member.id);

    if (deleteError) {
      console.error(deleteError);
      setFormError(deleteError.message || "Delete failed. Check RLS policies.");
      return;
    }

    await reloadStaff();
  };

  if (loading) return <p>Loading staff…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="staff-page">
      {isAdmin ? (
        <form className="staff-form" onSubmit={handleSubmit}>
          <div className="staff-form-header">
            <div>
              <strong>{editingId ? "Edit staff profile" : "Add staff profile"}</strong>
              <div className="staff-form-subtitle">
                {editingId
                  ? "Update staff details and save changes."
                  : "Create a new staff profile in the directory."}
              </div>
            </div>
            {editingId && (
              <button
                className="staff-form-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="staff-form-grid">
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
              Job title*
              <input
                name="job_title"
                value={formState.job_title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Role*
              <input
                name="role"
                value={formState.role}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Lab assigned*
              <input
                name="lab_assigned"
                value={formState.lab_assigned}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email*
              <input
                name="email"
                type="email"
                value={formState.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Telephone
              <input
                name="telephone"
                value={formState.telephone}
                onChange={handleInputChange}
              />
            </label>
            <label>
              CWID*
              <input
                name="cwid"
                inputMode="numeric"
                value={formState.cwid}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <div className="staff-form-communities">
            <span>Communities</span>
            <label>
              <input
                type="checkbox"
                name="community_fws"
                checked={formState.community_fws}
                onChange={handleInputChange}
              />
              FWS
            </label>
            <label>
              <input
                type="checkbox"
                name="community_mesa"
                checked={formState.community_mesa}
                onChange={handleInputChange}
              />
              MESA
            </label>
            <label>
              <input
                type="checkbox"
                name="community_umoja"
                checked={formState.community_umoja}
                onChange={handleInputChange}
              />
              Umoja
            </label>
            <label>
              <input
                type="checkbox"
                name="community_puente"
                checked={formState.community_puente}
                onChange={handleInputChange}
              />
              Puente
            </label>
            <label>
              <input
                type="checkbox"
                name="community_veteran"
                checked={formState.community_veteran}
                onChange={handleInputChange}
              />
              Veteran
            </label>
          </div>

          {formError && <div className="staff-form-error">{formError}</div>}

          <div className="staff-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add staff"}
            </button>
          </div>
        </form>
      ) : (
        <div className="staff-form" style={{ padding: 16 }}>
          Admin access required to add or edit staff profiles.
        </div>
      )}

      <div className="staff-search">
        <span aria-hidden="true">🔍</span>
        <input
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {staff.length === 0 ? (
        <p>No staff found.</p>
      ) : (
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
              {isAdmin && (
                <div className="staff-actions">
                  <button
                    className="staff-action"
                    type="button"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="staff-action staff-action-danger"
                    type="button"
                    onClick={() => handleDelete(s)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
