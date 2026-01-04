import { useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  onNavigate: (page: string) => void;
};

const ResetPasswordConfirmPage = ({ onNavigate }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);

    // ✅ Step 5: actually set the new password
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 🔐 IMPORTANT: sign out after reset
    await supabase.auth.signOut();

    // ✅ Go back to login
    onNavigate("login");
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h1 className="create-title">Set New Password</h1>

        <div className="create-card">
          <input
            className="form-input"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            className="login-button"
            onClick={handleReset}
            disabled={loading || password.length < 6}
          >
            {loading ? "Updating..." : "Confirm Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
