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
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // 2. Dispatch Action
    const result = await dispatch(signupUser({ email, password, role }));
    
    if (signupUser.fulfilled.match(result)) {
      setShowSuccess(true);
   
      setTimeout(() => navigate("/dashboard"), 2500);
    }
  };

  return (
    <div style={styles.page}>



      <div style={styles.grid} />
      <div style={styles.glow1} />
      <div style={styles.glow2} />
      {showSuccess && (
        <div style={styles.successOverlay} className="animate-in">
          <div style={styles.successCard}>
            <div style={{ fontSize: 40 }}>🚀</div>
            <h3 style={{ margin: "10px 0" }}>Welcome to the future, Doc!</h3>
            <p>Scrubbing in... we're preparing your clinical suite.</p>
          </div>
        </div>
      )}
      <div style={styles.container} className="animate-in">
        {/* Left Panel - Shared Hero */}
        <div style={styles.leftPanel}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="12" y="2" width="4" height="24" rx="2" fill="white" />
                <rect x="2" y="12" width="24" height="4" rx="2" fill="white" />
                <circle cx="14" cy="14" r="5" fill="none" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div style={styles.logoText}>RAGA Health</div>
              <div style={styles.logoSub}>Enterprise Platform</div>
            </div>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Join the<br />Future of<br />
              <span style={{ color: "var(--accent)" }}>Clinical Care.</span>
            </h1>
            <p style={styles.heroDesc}>
              Create your professional account to access unified patient records 
              and AI-driven healthcare intelligence.
            </p>
          </div>

          <div style={styles.pulseBar}>
            <div style={styles.pulseText}>Security Compliance</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>
                HIPAA & SOC2 Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div style={styles.rightPanel}>
          <h2 style={styles.formTitle}>Create your account</h2>
          <p style={styles.formSub}>Enter clinical details to get started</p>

          <form onSubmit={handleSignup} style={styles.form}>
           
            <div style={styles.field}>
              <label style={styles.label}>Clinical Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { 
                  setEmail(e.target.value); 
                  setValidationErrors(prev => prev.filter(err => err !== "email"));
                }}
                placeholder="you@raga.health"
                style={{
                  ...styles.input,
                  
                  borderColor: validationErrors.includes("email") 
                    ? "var(--red)" 
                    : focusedField === "email" ? "var(--accent)" : "var(--border)",
                  boxShadow: validationErrors.includes("email") ? "0 0 0 2px rgba(240,86,86,0.2)" : "none"
                }}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

           
<div style={styles.field}>
              <label style={styles.label}>Secure Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationErrors(prev => prev.filter(err => err !== "password"));
                }}
                placeholder="Min. 8 characters"
                style={{
                  ...styles.input,
                  borderColor: validationErrors.includes("password") 
                    ? "var(--red)" 
                    : focusedField === "password" ? "var(--accent)" : "var(--border)",
                  boxShadow: validationErrors.includes("password") ? "0 0 0 2px rgba(240,86,86,0.2)" : "none"
                }}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              {validationErrors.includes("password") && (
                <span style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>
                  Password must be at least 8 characters long.
                </span>
              )}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Clinical Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                style={styles.input}
              >
                <option value="doctor">Medical Doctor (MD/DO)</option>
                <option value="nurse">Registered Nurse (RN/NP)</option>
              </select>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}

<button type="submit" disabled={loading || showSuccess} style={styles.submitBtn}>
              {loading ? "Verifying Credentials..." : "Scrub In →"}
            </button>
       
           
          </form>

          <p style={styles.hint}>
            Already have an account? <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflowX: "hidden",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  glow1: {
    position: "fixed",
    top: "-20%",
    left: "-10%",
    width: "50%",
    height: "60%",
    background: "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glow2: {
    position: "fixed",
    bottom: "-20%",
    right: "-10%",
    width: "50%",
    height: "60%",
    background: "radial-gradient(circle, rgba(79,163,232,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    display: "flex",
    flexDirection: "row", // Will be overridden by CSS for mobile
    width: "100%",
    maxWidth: 1000,
    minHeight: 600,
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid var(--border)",
    boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
    position: "relative",
    zIndex: 1,
    flexWrap: "wrap", // Allows wrapping on small screens
  },
  leftPanel: {
    flex: "1 1 400px", // Grow, shrink, and set a base
    background: "linear-gradient(135deg, #0a2040 0%, #071628 100%)",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 32,
    borderRight: "1px solid var(--border)",
  },
  logoArea: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: {
    width: 48,
    height: 48,
    background: "var(--accent)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: 20,
    color: "var(--text-primary)",
    letterSpacing: "-0.5px",
  },
  logoSub: {
    fontSize: 11,
    color: "var(--text-muted)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "clamp(32px, 5vw, 42px)", // Responsive font size
    lineHeight: 1.1,
    letterSpacing: "-1px",
    color: "var(--text-primary)",
  },
  heroDesc: {
    fontSize: 15,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    maxWidth: 340,
  },
  statsRow: {
    display: "flex",
    gap: 20,
    borderTop: "1px solid var(--border)",
    paddingTop: 24,
    flexWrap: "wrap",
  },
  stat: { minWidth: "80px" },
  statValue: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 22,
    color: "var(--accent)",
  },
  statLabel: { fontSize: 12, color: "var(--text-muted)", marginTop: 2 },
  pulseBar: {
    background: "rgba(0,212,170,0.06)",
    border: "1px solid rgba(0,212,170,0.2)",
    borderRadius: 10,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pulseText: { fontSize: 12, color: "var(--text-muted)" },
  rightPanel: {
    flex: "1 1 400px", // Matches left panel for equal stacking
    background: "var(--bg-card)",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  formTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 26,
    letterSpacing: "-0.5px",
    color: "var(--text-primary)",
  },
  formSub: { fontSize: 14, color: "var(--text-secondary)", marginTop: -12 },
  demoRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  demoBtn: {
    flex: 1,
    minWidth: "80px",
    padding: "8px 12px",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-secondary)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" },
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text-primary)",
    fontSize: 15,
    outline: "none",
    fontFamily: "var(--font-body)",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  errorBox: {
    background: "rgba(240,86,86,0.1)",
    border: "1px solid rgba(240,86,86,0.3)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    color: "#f05656",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "var(--accent)",
    border: "none",
    borderRadius: 10,
    color: "#051a14",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-display)",
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: "var(--text-muted)",
    textAlign: "center",
    marginTop: 20,
  },
  successOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(7, 22, 40, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(10px)",
    padding: 20,
  },
  successCard: {
    background: "var(--bg-card)",
    padding: "40px",
    borderRadius: "28px",
    textAlign: "center",
    border: "1px solid var(--accent)",
    width: "100%",
    maxWidth: "360px",
  },
};