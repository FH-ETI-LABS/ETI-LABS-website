import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type StaffRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  lab_assigned?: string | null;
};

export default function StaffList() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaff = async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("id, first_name, last_name, email, role, lab_assigned")
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

  if (loading) return <p>Loading staff…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (staff.length === 0) return <p>No staff found.</p>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {staff.map((s) => (
        <div key={s.id} className="content-card">
          <strong>
            {s.first_name} {s.last_name}
          </strong>
          <div style={{ opacity: 0.8 }}>{s.email}</div>
          <div>
            Role: <strong>{s.role}</strong>
          </div>
          {s.lab_assigned && <div>Lab: {s.lab_assigned}</div>}
        </div>
      ))}
    </div>
  );
}
