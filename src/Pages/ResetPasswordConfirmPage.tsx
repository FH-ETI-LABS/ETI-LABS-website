import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  onNavigate: (page: string) => void;
};

const ResetPasswordConfirmPage = ({ onNavigate }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [linkValid, setLinkValid] = useState<boolean | null>(null);

  // ✅ Only allow this page if the URL is actually a recovery link
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        console.debug("ResetPasswordConfirmPage: attempting to parse session from URL");
        // Ask the SDK to parse/store the session if present in the URL
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await supabase.auth.getSessionFromUrl();
      } catch (err) {
        console.debug("ResetPasswordConfirmPage: getSessionFromUrl failed", err);
      }

      // After attempting to parse, check whether a session exists or if the URL
      // contains a recovery token. If neither is true, we consider the link
      // invalid/expired and show a helpful UI instead of force-redirecting.
      const sessionResp = await supabase.auth.getSession();
      const sessionExists = !!sessionResp?.data?.session;
      const hash = window.location.hash || "";
      const search = window.location.search || "";
      const hasRecoveryToken =
        hash.includes("type=recovery") ||
        hash.includes("access_token=") ||
        search.includes("access_token=") ||
        search.includes("type=recovery");

      if (!active) return;
      if (sessionExists || hasRecoveryToken) {
        setLinkValid(true);
      } else {
        setLinkValid(false);
      }
    })();
    // ensure the "checking" state is cleared after the async work finishes
    (async () => {
      await new Promise((r) => setTimeout(r, 0));
      setChecking(false);
    })();

    return () => {
      active = false;
    };
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

    // Show success and then redirect to login after a short delay so the user
    // sees confirmation text.
    setSuccess(true);
    setLoading(false);

    setTimeout(async () => {
      try {
        await supabase.auth.signOut();
      } catch {}
      onNavigate("landing");
    }, 2200);
  };

  if (checking) {
    return (
      <div className="create-page">
        <div className="create-container">
          <div className="create-card">Checking reset link...</div>
        </div>
      </div>
    );
  }

  if (linkValid === false) {
    return (
      <div className="create-page">
        <div className="create-container">
          <h1 className="create-title">Reset Password</h1>
          <div className="create-card">
            <h2>Invalid or expired reset link</h2>
            <p>The password reset link appears to be invalid or expired. You can request a new reset email.</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => onNavigate && onNavigate('password-reset')}>Request new reset email</button>
              <button style={{ marginLeft: 8 }} className="btn btn-ghost" onClick={() => onNavigate && onNavigate('landing')}>Back to Sign In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-page">
      <div className="create-container">
        <h1 className="create-title">Set New Password</h1>

        <div className="create-card">
          {!success ? (
            <>
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
            </>
          ) : (
            <div style={{ padding: 12 }}>
              <h3 style={{ color: "green" }}>Password updated</h3>
              <p>You will be redirected to the login page shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
