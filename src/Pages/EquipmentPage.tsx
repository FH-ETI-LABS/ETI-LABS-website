import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "../lib/supabase";
import type { LabEquipmentRow } from "../lib/supabase";

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<LabEquipmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  type EquipmentFormState = {
    resource_name: string;
    resource_description: string;
    lab: string;
  };

  const emptyForm: EquipmentFormState = {
    resource_name: "",
    resource_description: "",
    lab: "",
  };

  const [formState, setFormState] = useState<EquipmentFormState>(emptyForm);

  useEffect(() => {
    const loadEquipment = async () => {
      const { data, error } = await supabase
        .from("lab_equipment")
        .select("id, resource_name, resource_description, lab")
        .order("resource_name", { ascending: true });

      if (error) {
        console.error(error);
        setError("Failed to load equipment");
      } else {
        setEquipment(data ?? []);
      }

      setLoading(false);
    };

    loadEquipment();
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

  const reloadEquipment = async () => {
    const { data, error: loadError } = await supabase
      .from("lab_equipment")
      .select("id, resource_name, resource_description, lab")
      .order("resource_name", { ascending: true });

    if (loadError) {
      console.error(loadError);
      setError("Failed to load equipment");
      return;
    }

    setEquipment(data ?? []);
  };

  const filteredEquipment = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return equipment;
    return equipment.filter((item) => {
      const haystack = [
        item.resource_name,
        item.resource_description,
        item.lab,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [equipment, query]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormError(null);
    setFormState(emptyForm);
  };

  const handleEdit = (item: LabEquipmentRow) => {
    setEditingId(item.id);
    setFormError(null);
    setFormState({
      resource_name: item.resource_name ?? "",
      resource_description: item.resource_description ?? "",
      lab: item.lab ?? "",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const requiredFields = [
      formState.resource_name.trim(),
      formState.lab.trim(),
    ];

    if (requiredFields.some((field) => !field)) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    const payload = {
      resource_name: formState.resource_name.trim(),
      resource_description: formState.resource_description.trim() || null,
      lab: formState.lab.trim(),
    };

    const { error: saveError } = editingId
      ? await supabase.from("lab_equipment").update(payload).eq("id", editingId)
      : await supabase.from("lab_equipment").insert(payload);

    if (saveError) {
      console.error(saveError);
      setFormError(saveError.message || "Failed to save equipment.");
      setSaving(false);
      return;
    }

    await reloadEquipment();
    setSaving(false);
    resetForm();
  };

  const handleDelete = async (item: LabEquipmentRow) => {
    const confirmed = window.confirm(
      `Delete ${item.resource_name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("lab_equipment")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      console.error(deleteError);
      setFormError(deleteError.message || "Delete failed. Check RLS policies.");
      return;
    }

    await reloadEquipment();
  };

  if (loading) return <p>Loading equipment…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="equipment-panel">
      {isAdmin ? (
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="equipment-form-header">
            <div>
              <strong>{editingId ? "Edit equipment" : "Add equipment"}</strong>
              <div className="equipment-form-subtitle">
                {editingId
                  ? "Update equipment details and save."
                  : "Add a new resource to the lab inventory."}
              </div>
            </div>
            {editingId && (
              <button
                className="equipment-form-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="equipment-form-grid">
            <label>
              Resource name*
              <input
                name="resource_name"
                value={formState.resource_name}
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
            <label className="equipment-form-description">
              Description
              <textarea
                name="resource_description"
                rows={3}
                value={formState.resource_description}
                onChange={handleInputChange}
              />
            </label>
          </div>

          {formError && (
            <div className="equipment-form-error">{formError}</div>
          )}

          <div className="equipment-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add equipment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="equipment-auth-hint">
          {authUser
            ? "Admin access required to add or edit lab equipment."
            : "Sign in as an admin to add or edit lab equipment."}
        </div>
      )}

      <div className="equipment-search">
        <span aria-hidden="true">🔍</span>
        <input
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filteredEquipment.length === 0 ? (
        <p>No equipment found.</p>
      ) : (
        <div className="equipment-grid">
          {filteredEquipment.map((item) => (
            <div key={item.id} className="equipment-card">
              <div className="equipment-card-header">
                <strong>{item.resource_name}</strong>
                {isAdmin && (
                  <div className="equipment-card-actions">
                    <button type="button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="equipment-card-danger"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {item.resource_description && <p>{item.resource_description}</p>}
              <p>{item.lab}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentPage;
