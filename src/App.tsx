import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import LandingPage from "./Pages/Public/landingpage";
import LabPreviewPage from "./Pages/Public/LabPreviewPage.tsx";

import LoginPage from "./Pages/LoginPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import PasswordResetPage from "./Pages/PasswordResetPage";
import ResetPasswordConfirmPage from "./Pages/ResetPasswordConfirmPage";
import DashboardPage from "./Pages/DashboardPage";

export default function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      console.debug("App: init - checking existing session");
      const { data } = await supabase.auth.getSession();
      console.debug("App: getSession", { sessionPresent: !!data?.session });
      setSession(data.session);
      setLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.debug("App:onAuthStateChange", { event: _event, hasSession: !!newSession });
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/labs/:labId" element={<LabPreviewPage />} />

      {/* AUTH PAGES */}
      <Route
        path="/login"
        element={
          <LoginPage
            onNavigate={(page) => {
              if (page === "create-account") navigate("/create-account");
              else if (page === "password-reset") navigate("/password-reset");
              else if (page === "dashboard") navigate("/dashboard");
              else if (page === "landing") navigate("/");
              else navigate("/login");
            }}
          />
        }
      />
      <Route
        path="/create-account"
        element={<CreateAccountPage onNavigate={(page) => navigate(page === "login" ? "/login" : "/") } />}
      />
      <Route
        path="/password-reset"
        element={<PasswordResetPage onNavigate={(page) => navigate(page === "login" ? "/login" : "/") } />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordConfirmPage onNavigate={(page) => navigate(page === "login" ? "/login" : "/") } />}
      />

      {/* PRIVATE */}
      <Route
        path="/dashboard"
        element={session ? <DashboardPage /> : <Navigate to="/login" replace />}
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
