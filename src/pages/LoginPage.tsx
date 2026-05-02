import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginUser, clearError } from "../store/slices/authSlice";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    const errors: string[] = [];
    if (!email.includes("@")) errors.push("email");
    if (password.length < 1) errors.push("password");
    if (errors.length > 0) { setValidationErrors(errors); return; }
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      setShowSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    }
  };

  const fillDemo = (role: string) => {
    const creds: Record<string, { email: string; password: string }> = {
      admin: { email: "admin@raga.health", password: "Admin@123" },
      doctor: { email: "doctor@raga.health", password: "Doctor@123" },
      nurse: { email: "nurse@raga.health", password: "Nurse@123" },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    setValidationErrors([]);
    dispatch(clearError());
  };

  return (
    <div style={s.page}>
      {/* Dynamic Style Tag for Responsiveness */}
      <style>{`
        @media (max-width: 850px) {
          .left-panel-hide { display: none !important; }
          .container-responsive { max-width: 450px !important; }
        }
      `}</style>

      <div style={s.grid} />
      <div style={s.glow1} />
      <div style={s.glow2} />

      {showSuccess && (
        <div style={s.successOverlay}>
          <div style={s.successCard}>
            <div style={{ fontSize: 40 }}>🩺</div>
            <h3 style={{ margin: "10px 0", color: "var(--text1)" }}>Credentials Verified</h3>
            <p style={{ color: "var(--text2)" }}>Accessing clinical environment...</p>
          </div>
        </div>
      )}

      <div style={s.container} className="container-responsive">
        {/* Left panel - Hidden on Mobile */}
        <div style={s.leftPanel} className="left-panel-hide">
          <div style={s.logoArea}>
            <div style={s.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="12" y="2" width="4" height="24" rx="2" fill="white" />
                <rect x="2" y="12" width="24" height="4" rx="2" fill="white" />
                <circle cx="14" cy="14" r="5" fill="none" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div style={s.logoText}>RAGA Health</div>
              <div style={s.logoSub}>Enterprise Platform</div>
            </div>
          </div>
          <div style={s.heroContent}>
            <h1 style={s.heroTitle}>
              Healthcare<br />Intelligence<br />
              <span style={{ color: "var(--teal)" }}>Redefined.</span>
            </h1>
            <p style={s.heroDesc}>
              Unified patient management, real-time analytics, and clinical workflows — built for modern healthcare teams.
            </p>
          </div>
          <div style={s.statsRow}>
            {[{ value: "12K+", label: "Patients" }, { value: "98%", label: "Uptime" }, { value: "4 Depts", label: "Connected" }].map(stat => (
              <div key={stat.label} style={{ minWidth: 80 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--teal)" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={s.pulseBar}>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>System Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
              <span style={{ color: "var(--teal)", fontSize: 13, fontWeight: 600 }}>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={s.rightPanel}>
          <h2 style={s.formTitle}>Sign in to your account</h2>
          <p style={s.formSub}>Use demo credentials or your own account</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {["admin", "doctor", "nurse"].map(role => (
              <button key={role} onClick={() => fillDemo(role)} style={s.demoBtn}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" as const, gap: 18 }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              <label style={s.label}>Email Address</label>
              <input
                type="email" value={email} placeholder="you@raga.health" required
                onChange={e => { setEmail(e.target.value); setValidationErrors(p => p.filter(x => x !== "email")); dispatch(clearError()); }}
                onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                style={{ ...s.input, borderColor: validationErrors.includes("email") ? "var(--red)" : focusedField === "email" ? "var(--teal)" : "var(--border)", boxShadow: validationErrors.includes("email") ? "0 0 0 2px rgba(255,77,109,0.2)" : "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              <label style={s.label}>Password</label>
              <div style={{ position: "relative" as const }}>
                <input
                  type={showPassword ? "text" : "password"} value={password} placeholder="••••••••" required
                  onChange={e => { setPassword(e.target.value); setValidationErrors(p => p.filter(x => x !== "password")); dispatch(clearError()); }}
                  onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                  style={{ ...s.input, paddingRight: 48, borderColor: validationErrors.includes("password") ? "var(--red)" : focusedField === "password" ? "var(--teal)" : "var(--border)", boxShadow: validationErrors.includes("password") ? "0 0 0 2px rgba(255,77,109,0.2)" : "none" }}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--red)", display: "flex", alignItems: "center", gap: 8 }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" disabled={loading || showSuccess} style={{ ...s.submitBtn, opacity: loading || showSuccess ? 0.7 : 1 }}>
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
            <div style={{ textAlign: "center" as const }}>
              <p style={{ color: "var(--text2)", fontSize: 14 }}>
                New to the platform?{" "}
                <Link to="/signup" style={{ color: "var(--teal)", textDecoration: "none", fontWeight: 600 }}>Create an account</Link>
              </p>
            </div>
          </form>
          <p style={{ fontSize: 12, color: "var(--text3)", textAlign: "center" as const }}>
            🔐 Secured by Firebase Authentication
          </p>
        </div>
      </div>
    </div>
  );
};

// ... keep your 's' constant same as original, ensuring leftPanel and rightPanel have flex: "1 1 380px" ...
const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflowX: "hidden", background: "var(--navy)" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" },
  glow1: { position: "fixed", top: "-20%", left: "-10%", width: "50%", height: "60%", background: "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)", pointerEvents: "none" },
  glow2: { position: "fixed", bottom: "-20%", right: "-10%", width: "50%", height: "60%", background: "radial-gradient(circle, rgba(77,171,247,0.07) 0%, transparent 70%)", pointerEvents: "none" },
  container: { display: "flex", flexDirection: "row", width: "100%", maxWidth: 1000, minHeight: 600, borderRadius: 24, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 20px 80px rgba(0,0,0,0.6)", position: "relative", zIndex: 1 },
  leftPanel: { flex: "1 1 380px", background: "linear-gradient(135deg, #0a2040 0%, #071628 100%)", padding: "48px 40px", display: "flex", flexDirection: "column", gap: 32, borderRight: "1px solid var(--border)" },
  logoArea: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 48, height: 48, background: "var(--teal)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoText: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--text1)", letterSpacing: "-0.5px" },
  logoSub: { fontSize: 11, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase" },
  heroContent: { flex: 1, display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" },
  heroTitle: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1, letterSpacing: "-1px", color: "var(--text1)" },
  heroDesc: { fontSize: 15, color: "var(--text2)", lineHeight: 1.6, maxWidth: 340 },
  statsRow: { display: "flex", gap: 20, borderTop: "1px solid var(--border)", paddingTop: 24, flexWrap: "wrap" },
  pulseBar: { background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  rightPanel: { flex: "1 1 380px", background: "var(--navy2)", padding: "48px 40px", display: "flex", flexDirection: "column", gap: 20 },
  formTitle: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, letterSpacing: "-0.5px", color: "var(--text1)" },
  formSub: { fontSize: 14, color: "var(--text2)", marginTop: -12 },
  label: { fontSize: 13, fontWeight: 500, color: "var(--text2)" },
  demoBtn: { flex: 1, minWidth: 80, padding: "8px 12px", background: "var(--navy3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text2)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)" },
  input: { width: "100%", padding: "12px 16px", background: "var(--navy3)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text1)", fontSize: 15, outline: "none", fontFamily: "var(--font-body)", transition: "border-color 0.2s" },
  submitBtn: { width: "100%", padding: 14, background: "var(--teal)", border: "none", borderRadius: 10, color: "#051a14", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)", marginTop: 4, transition: "opacity 0.2s" },
  successOverlay: { position: "fixed", inset: 0, background: "rgba(7,22,40,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)", padding: 20 },
  successCard: { background: "var(--navy2)", padding: 40, borderRadius: 28, textAlign: "center", border: "1px solid var(--teal)", width: "100%", maxWidth: 360 },
};

export default LoginPage;