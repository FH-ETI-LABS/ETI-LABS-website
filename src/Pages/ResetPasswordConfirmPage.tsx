import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  onNavigate: (page: string) => void;
};

const ResetPasswordConfirmPage = ({ onNavigate }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Only allow this page if the URL is actually a recovery link
  useEffect(() => {
    const hash = window.location.hash || "";
    if (!hash.includes("type=recovery")) {
      onNavigate("login");
      return;
    }
  }, [onNavigate]);

  const handleReset = async () => {
    setLoading(true);
    setError(null);

    // ✅ Set the new password (requires recovery session)
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // ✅ Clear recovery hash from URL so refresh never re-triggers recovery
    window.history.replaceState(null, "", window.location.pathname);

    // ✅ Force logout after reset, then send to login
    await supabase.auth.signOut();
    setLoading(false);

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
