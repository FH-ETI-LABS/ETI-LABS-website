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
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const init = async () => {
      const hash = window.location.hash;

      // ✅ Detect password recovery FIRST
      if (hash.includes("type=recovery")) {
        setIsRecovery(true);
        setPage("reset-password");
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session) {
        setPage("dashboard");
      } else {
        setPage("login");
      }

      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // 🚫 DO NOT redirect during recovery
      if (isRecovery) return;

      if (session) {
        setPage("dashboard");
      } else {
        setPage("login");
      }
    });

    return () => subscription.unsubscribe();
  }, [isRecovery]);

  if (loading) return null;

  // 🔑 Recovery page ALWAYS wins
  if (isRecovery && page === "reset-password") {
    return <ResetPasswordConfirmPage onNavigate={setPage} />;
  }

  // 🔒 Logged in (normal)
  if (session) {
    return <DashboardPage onNavigate={setPage} />;
  }

  // 🔓 Public pages
  switch (page) {
    case "login":
      return <LoginPage onNavigate={setPage} />;

    case "create-account":
      return <CreateAccountPage onNavigate={setPage} />;

    case "password-reset":
      return <PasswordResetPage onNavigate={setPage} />;

    default:
      return <LandingPage onNavigate={setPage} />;
  }
}

export default App;
