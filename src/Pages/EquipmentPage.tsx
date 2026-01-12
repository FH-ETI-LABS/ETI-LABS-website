import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { LabEquipmentRow } from "../lib/supabase";

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<LabEquipmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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
  }, []);

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

  if (loading) return <p>Loading equipment…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="equipment-panel">
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
              <strong>{item.resource_name}</strong>
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
