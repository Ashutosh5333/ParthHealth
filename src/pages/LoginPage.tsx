import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(s => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) dispatch(loginUser({ email, password }));
  };

  const fillDemo = (role: string) => {
    const creds: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@raga.health', password: 'Admin@123' },
      doctor: { email: 'doctor@raga.health', password: 'Doctor@123' },
      nurse: { email: 'nurse@raga.health', password: 'Nurse@123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    dispatch(clearError());
  };

  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.grid} />
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.container} className="animate-in">
        {/* Left panel */}
        <div style={styles.leftPanel}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="12" y="2" width="4" height="24" rx="2" fill="white"/>
                <rect x="2" y="12" width="24" height="4" rx="2" fill="white"/>
                <circle cx="14" cy="14" r="5" fill="none" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <div style={styles.logoText}>RAGA Health</div>
              <div style={styles.logoSub}>Enterprise Platform</div>
            </div>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Healthcare<br />Intelligence<br />
              <span style={{ color: 'var(--accent)' }}>Redefined.</span>
            </h1>
            <p style={styles.heroDesc}>
              Unified patient management, real-time analytics, and clinical workflows — 
              built for modern healthcare teams.
            </p>
          </div>

          <div style={styles.statsRow}>
            {[
              { value: '12K+', label: 'Patients' },
              { value: '98%', label: 'Uptime' },
              { value: '4 Depts', label: 'Connected' },
            ].map(s => (
              <div key={s.label} style={styles.stat}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={styles.pulseBar}>
            <div style={styles.pulseText}>System Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="status-dot dot-stable" style={{ width: 8, height: 8 }} />
              <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Right panel - login form */}
        <div style={styles.rightPanel}>
          <h2 style={styles.formTitle}>Sign in to your account</h2>
          <p style={styles.formSub}>Use demo credentials or your own account</p>

          {/* Demo quick-fill */}
          <div style={styles.demoRow}>
            {['admin', 'doctor', 'nurse'].map(role => (
              <button key={role} style={styles.demoBtn} onClick={() => fillDemo(role)}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); dispatch(clearError()); }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@raga.health"
                  style={{
                    ...styles.input,
                    borderColor: focusedField === 'email' ? 'var(--accent)' : error ? 'var(--red)' : 'var(--border)',
                    boxShadow: focusedField === 'email' ? '0 0 0 3px var(--accent-dim)' : 'none',
                  }}
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); dispatch(clearError()); }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  style={{
                    ...styles.input,
                    paddingRight: 48,
                    borderColor: focusedField === 'password' ? 'var(--accent)' : error ? 'var(--red)' : 'var(--border)',
                    boxShadow: focusedField === 'password' ? '0 0 0 3px var(--accent-dim)' : 'none',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div style={styles.errorBox} className="animate-in">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              style={styles.submitBtn}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <span className="loader" style={{ width: 16, height: 16 }} />
                  Authenticating...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <p style={styles.hint}>
            🔐 Secured by Firebase Authentication · HIPAA Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  glow1: {
    position: 'fixed',
    top: '-20%',
    left: '-10%',
    width: '50%',
    height: '60%',
    background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'fixed',
    bottom: '-20%',
    right: '-10%',
    width: '50%',
    height: '60%',
    background: 'radial-gradient(circle, rgba(79,163,232,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: 960,
    minHeight: 580,
    borderRadius: 24,
    overflow: 'hidden',
    border: '1px solid var(--border)',
    boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
    position: 'relative',
    zIndex: 1,
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #0a2040 0%, #071628 100%)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    borderRight: '1px solid var(--border)',
    minWidth: 0,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 48,
    height: 48,
    background: 'var(--accent)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 20,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  logoSub: { fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' },
  heroContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 42,
    lineHeight: 1.1,
    letterSpacing: '-1px',
    color: 'var(--text-primary)',
  },
  heroDesc: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    maxWidth: 340,
  },
  statsRow: {
    display: 'flex',
    gap: 24,
    borderTop: '1px solid var(--border)',
    paddingTop: 24,
  },
  stat: { flex: 1 },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 22,
    color: 'var(--accent)',
  },
  statLabel: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  pulseBar: {
    background: 'rgba(0,212,170,0.06)',
    border: '1px solid rgba(0,212,170,0.2)',
    borderRadius: 10,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pulseText: { fontSize: 12, color: 'var(--text-muted)' },
  rightPanel: {
    width: 420,
    background: 'var(--bg-card)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    flexShrink: 0,
  },
  formTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 26,
    letterSpacing: '-0.5px',
    color: 'var(--text-primary)',
  },
  formSub: { fontSize: 14, color: 'var(--text-secondary)', marginTop: -12 },
  demoRow: { display: 'flex', gap: 8 },
  demoBtn: {
    flex: 1,
    padding: '8px 12px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    padding: '4px',
    lineHeight: 1,
  },
  errorBox: {
    background: 'var(--red-dim)',
    border: '1px solid rgba(240,86,86,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    color: 'var(--red)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 10,
    color: '#051a14',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.5px',
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 16,
  },
};

export default LoginPage;
