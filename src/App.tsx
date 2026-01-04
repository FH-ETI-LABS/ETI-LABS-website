import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import LandingPage from "./Pages/landingpage";
import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import PasswordResetPage from "./Pages/PasswordResetPage";
import ResetPasswordConfirmPage from "./Pages/ResetPasswordConfirmPage";
import DashboardPage from "./Pages/DashboardPage";

type Page =
  | "landing"
  | "login"
  | "create-account"
  | "password-reset"
  | "reset-password"
  | "dashboard";

function App() {
  const [page, setPage] = useState<Page>("landing");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const hash = window.location.hash || "";

      // ✅ If this is a Supabase recovery link, show reset screen
      if (hash.includes("type=recovery")) {
        setPage("reset-password");
        setLoading(false);
        return;
      }

      // ✅ Otherwise, normalize URL so refresh never keeps old hash junk
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session) setPage("dashboard");
      else setPage("login");

      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      // ✅ If we are currently on reset-password page, DO NOT auto-redirect
      if (page === "reset-password") return;

      if (newSession) setPage("dashboard");
      else setPage("login");
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) return null;

  // ✅ Recovery page has priority
  if (page === "reset-password") {
    return <ResetPasswordConfirmPage onNavigate={setPage} />;
  }

  // ✅ Logged in → dashboard
  if (session) {
    return <DashboardPage onNavigate={setPage} />;
  }

  // ✅ Public pages
  switch (page) {
    case "login":
      return <LoginPage onNavigate={setPage} />;

    case "create-account":
      return <CreateAccountPage onNavigate={setPage} />;

    case "password-reset":
      return <PasswordResetPage onNavigate={setPage} />;

    case "landing":
    default:
      return <LandingPage onNavigate={setPage} />;
  }
}

export default App;
