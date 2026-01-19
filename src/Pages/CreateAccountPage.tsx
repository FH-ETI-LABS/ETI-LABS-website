import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./CreateAccountPage.css";

type CreateAccountPageProps = {
  onNavigate: (page: string) => void;
};

const CreateAccountPage = ({ onNavigate }: CreateAccountPageProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cwid, setCwid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleCreateAccount = async () => {
    setError(null);

    // 🔒 Basic validation
    if (!email || !password || !firstName || !lastName || !cwid) {
      setError("Please fill in all fields.");
      return;
    }

    const cwidTrimmed = cwid.trim();
    if (!/^\d{8}$/.test(cwidTrimmed)) {
      setError("CWID must be exactly 8 digits.");
      return;
    }
    const cwidValue = Number(cwidTrimmed);

    setLoading(true);

    try {
      /* ===============================
         1️⃣ Create Auth User
      =============================== */
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("No user returned from signup");

      const userId = data.user.id;

      /* ===============================
         2️⃣ Insert Staff Profile
      =============================== */
      const profilePayload = {
        user_id: userId,        // 🔥 CRITICAL LINK
        first_name: firstName,
        last_name: lastName,
        email: email,
        cwid: cwidValue,
        job_title: "Student",
        role: "ETI Member",
        lab_assigned: "ETI",
      };

      const { error: staffError } = await supabase
        .from("staff")
        .insert(profilePayload);

      if (staffError) {
        console.error(staffError);
        if (staffError.code === "23505") {
          throw new Error("Profile not saved. Email or CWID already exists.");
        }
        if (staffError.code === "42501") {
          localStorage.setItem(
            "pendingStaffProfile",
            JSON.stringify(profilePayload)
          );
          throw new Error(
            "Account created. Confirm your email, then sign in to finish your profile."
          );
        }
        throw new Error(
          staffError.message || "Account created, but failed to save profile."
        );
      }

      localStorage.removeItem("pendingStaffProfile");

      /* ===============================
         3️⃣ Success
      =============================== */
      alert(
        "Account created! Please check your email to confirm, then log in."
      );
      onNavigate("login");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`create-page ${darkMode ? "dark-mode" : ""}`}>
      {/* Top right icons */}
      <div className="create-icons">
        <button
          className="icon-btn"
          onClick={() => setDarkMode(prev => !prev)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button
          className="icon-btn"
          onClick={() => onNavigate("login")}
        >
          ←
        </button>
      </div>

      <div className="create-container">
        <h1 className="create-title">Create Account</h1>

        <div className="create-card">
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@foothill.edu"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input
              className="form-input"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Maria"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              className="form-input"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Polyakov"
            />
          </div>

          <div className="form-group">
            <label>CWID</label>
            <input
              className="form-input"
              inputMode="numeric"
              maxLength={8}
              pattern="\d{8}"
              value={cwid}
              onChange={e => setCwid(e.target.value)}
              placeholder="12345678"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            className="login-button"
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <div className="divider" />

          <button
            className="help-link"
            onClick={() => onNavigate("login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
