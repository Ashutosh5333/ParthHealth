import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { signupUser, clearError } from "../store/slices/authSlice";

export const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"doctor" | "nurse">("doctor");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    const errors: string[] = [];
    if (!email.includes("@")) errors.push("email");
    if (password.length < 8) errors.push("password");
    if (errors.length > 0) { setValidationErrors(errors); return; }
    const result = await dispatch(signupUser({ email, password, role }));
    if (signupUser.fulfilled.match(result)) {
      setShowSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2200);
    }
  };

  return (
    <div style={s.page}>
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
            <div style={{ fontSize: 40 }}>🚀</div>
            <h3 style={{ margin: "10px 0", color: "var(--text1)" }}>Welcome to the future, Doc!</h3>
            <p style={{ color: "var(--text2)" }}>Scrubbing in... we're preparing your clinical suite.</p>
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
              Join the<br />Future of<br />
              <span style={{ color: "var(--teal)" }}>Clinical Care.</span>
            </h1>
            <p style={s.heroDesc}>
              Create your professional account to access unified patient records and AI-driven healthcare intelligence.
            </p>
          </div>
          <div style={s.pulseBar}>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>Security Compliance</div>
            <span style={{ color: "var(--teal)", fontSize: 13, fontWeight: 600 }}>HIPAA &amp; SOC2 Ready</span>
          </div>
        </div>

        {/* Right panel */}
        <div style={s.rightPanel}>
          <h2 style={s.formTitle}>Create your account</h2>
          <p style={s.formSub}>Enter clinical details to get started</p>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column" as const, gap: 18 }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              <label style={s.label}>Clinical Email</label>
              <input
                type="email" value={email} placeholder="you@raga.health" required
                onChange={e => { setEmail(e.target.value); setValidationErrors(p => p.filter(x => x !== "email")); dispatch(clearError()); }}
                onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                style={{ ...s.input, borderColor: validationErrors.includes("email") ? "var(--red)" : focusedField === "email" ? "var(--teal)" : "var(--border)", boxShadow: validationErrors.includes("email") ? "0 0 0 2px rgba(255,77,109,0.2)" : "none" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              <label style={s.label}>Secure Password</label>
              <input
                type="password" value={password} placeholder="Min. 8 characters" required
                onChange={e => { setPassword(e.target.value); setValidationErrors(p => p.filter(x => x !== "password")); dispatch(clearError()); }}
                onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                style={{ ...s.input, borderColor: validationErrors.includes("password") ? "var(--red)" : focusedField === "password" ? "var(--teal)" : "var(--border)", boxShadow: validationErrors.includes("password") ? "0 0 0 2px rgba(255,77,109,0.2)" : "none" }}
              />
              {validationErrors.includes("password") && (
                <span style={{ fontSize: 11, color: "var(--red)" }}>Password must be at least 8 characters long.</span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              <label style={s.label}>Clinical Role</label>
              <select value={role} onChange={e => setRole(e.target.value as "doctor" | "nurse")} style={{ ...s.input, cursor: "pointer" }}>
                <option value="doctor">Medical Doctor (MD/DO)</option>
                <option value="nurse">Registered Nurse (RN/NP)</option>
              </select>
            </div>

            {error && (
              <div style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--red)", display: "flex", alignItems: "center", gap: 8 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading || showSuccess} style={{ ...s.submitBtn, opacity: loading || showSuccess ? 0.7 : 1 }}>
              {loading ? "Verifying Credentials..." : "Scrub In →"}
            </button>
          </form>

          <p style={{ fontSize: 13, color: "var(--text2)", textAlign: "center" as const }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--teal)", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflowX: "hidden", background: "var(--navy)" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" },
  glow1: { position: "fixed", top: "-20%", left: "-10%", width: "50%", height: "60%", background: "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)", pointerEvents: "none" },
  glow2: { position: "fixed", bottom: "-20%", right: "-10%", width: "50%", height: "60%", background: "radial-gradient(circle, rgba(77,171,247,0.07) 0%, transparent 70%)", pointerEvents: "none" },
  container: { display: "flex", flexDirection: "row", width: "100%", maxWidth: 1000, borderRadius: 24, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 20px 80px rgba(0,0,0,0.6)", position: "relative", zIndex: 1 },
  leftPanel: { flex: "1 1 380px", background: "linear-gradient(135deg, #0a2040 0%, #071628 100%)", padding: "48px 40px", display: "flex", flexDirection: "column", gap: 32, borderRight: "1px solid var(--border)" },
  logoArea: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 48, height: 48, background: "var(--teal)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoText: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--text1)", letterSpacing: "-0.5px" },
  logoSub: { fontSize: 11, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase" },
  heroContent: { flex: 1, display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" },
  heroTitle: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1, letterSpacing: "-1px", color: "var(--text1)" },
  heroDesc: { fontSize: 15, color: "var(--text2)", lineHeight: 1.6, maxWidth: 340 },
  pulseBar: { background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  rightPanel: { flex: "1 1 380px", background: "var(--navy2)", padding: "48px 40px", display: "flex", flexDirection: "column", gap: 20 },
  formTitle: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, letterSpacing: "-0.5px", color: "var(--text1)" },
  formSub: { fontSize: 14, color: "var(--text2)", marginTop: -12 },
  label: { fontSize: 13, fontWeight: 500, color: "var(--text2)" },
  input: { width: "100%", padding: "12px 16px", background: "var(--navy3)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text1)", fontSize: 15, outline: "none", fontFamily: "var(--font-body)", transition: "border-color 0.2s" },
  submitBtn: { width: "100%", padding: 14, background: "var(--teal)", border: "none", borderRadius: 10, color: "#051a14", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)", marginTop: 4, transition: "opacity 0.2s" },
  successOverlay: { position: "fixed", inset: 0, background: "rgba(7,22,40,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)", padding: 20 },
  successCard: { background: "var(--navy2)", padding: 40, borderRadius: 28, textAlign: "center", border: "1px solid var(--teal)", width: "100%", maxWidth: 360 },
};

export default SignupPage;