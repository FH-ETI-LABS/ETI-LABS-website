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

    if (hash.includes("type=recovery")) {
      setPage("reset-password");
      setLoading(false);
      return;
    }

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
  } = supabase.auth.onAuthStateChange((event, newSession) => {
    setSession(newSession);

    // ✅ ONLY redirect on actual auth events
    if (event === "SIGNED_IN") {
      setPage("dashboard");
    }

    if (event === "SIGNED_OUT") {
      setPage("login");
    }
  });

  return () => subscription.unsubscribe();
}, []);


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
