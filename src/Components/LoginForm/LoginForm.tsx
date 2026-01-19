import { useState } from "react";
import "./LoginForm.css";
import { supabase } from "../../lib/supabase";

type LoginFormProps = {
  onNavigate: (page: string) => void;
};

const LoginForm = ({ onNavigate }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const contactEmail =
    import.meta.env.VITE_CONTACT_EMAIL || "eti@fhda.edu";
  const contactPhone =
    import.meta.env.VITE_CONTACT_PHONE || "650.949.7236";
  const contactOffice =
    import.meta.env.VITE_CONTACT_OFFICE || "STEM Division Office 4118";

  // Prevent duplicate navigation
  const navigatedRef = { current: false } as { current: boolean };

  // Helper that returns a promise resolving when a session is available or
  // when SIGNED_IN is emitted. Used to avoid navigation-before-session race.
  const waitForSignIn = (timeout = 5000) => {
    return new Promise<void>((resolve) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve();
        }
      }, timeout);

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.debug("LoginForm:onAuthStateChange", { event, hasSession: !!session });
        if (settled) return;
        if (event === "SIGNED_IN" || session?.user) {
          settled = true;
          clearTimeout(timer);
          try {
            data.subscription.unsubscribe();
          } catch {}
          resolve();
        }
      });
    });
  };

  const handleLogin = async () => {
    console.debug("LoginForm: handleLogin start", { email });
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    console.debug("LoginForm: signInWithPassword result", { dataPresent: !!data, error });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // If sign-in returned a session we can navigate immediately. Otherwise
    // wait briefly for the auth state change listener in App to pick up the
    // new session before routing to the dashboard to avoid being redirected
    // back to /login by the private route guard.
    if (data?.session) {
      // session is already present, navigate immediately
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        onNavigate("dashboard");
      }
      return;
    }

    // Otherwise wait for an auth state change (SIGNED_IN) or timeout, then navigate.
    await waitForSignIn(4000);
    if (!navigatedRef.current) {
      navigatedRef.current = true;
      onNavigate("dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-logo">Sign In</h2>

        {/* ✅ FORM ONLY CONTAINS LOGIN */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "NEXT"}
          </button>
        </form>
        {/* ✅ EVERYTHING BELOW IS OUTSIDE THE FORM */}

        <button
          className="help-link"
          onClick={() => onNavigate("password-reset")}
        >
          Need help signing in?
        </button>

        <div className="divider" />

        <div className="login-links">
          <div className="section-title">New to ETI?</div>
          <button
            className="help-link"
            onClick={() => onNavigate("create-account")}
          >
            Create Account
          </button>
        </div>

        <div className="divider" />

        <div className="login-links">
          <div className="section-title">Contact Us</div>
          <div>Email us at {contactEmail}</div>
          <div>Call {contactPhone}</div>
          <div>Visit the {contactOffice}</div>
        </div>

        {errorMsg && (
          <p style={{ color: "red", marginTop: 10 }}>{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
