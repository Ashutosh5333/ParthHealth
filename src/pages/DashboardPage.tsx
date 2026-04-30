import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { addNotification } from '../store/slices/notificationsSlice';
import { NotificationService } from '../utils/notificationService';

const StatCard: React.FC<{ label: string; value: string | number; sub: string; color: string; icon: string }> = ({ label, value, sub, color, icon }) => (
  <div style={{ ...cardStyles.card, borderTop: `3px solid ${color}` }} className="animate-in">
    <div style={cardStyles.header}>
      <div style={{ ...cardStyles.icon, background: `${color}22`, color }}>{icon}</div>
      <span style={cardStyles.label}>{label}</span>
    </div>
    <div style={{ ...cardStyles.value, color }}>{value}</div>
    <div style={cardStyles.sub}>{sub}</div>
  </div>
);

const cardStyles: Record<string, React.CSSProperties> = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  icon: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  label: { fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  value: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-1px' },
  sub: { fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 },
};

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(s => s.auth);
  const { patients } = useAppSelector(s => s.patients);

  const criticalCount = patients.filter(p => p.status === 'Critical').length;
  const stableCount = patients.filter(p => p.status === 'Stable').length;
  const recoveringCount = patients.filter(p => p.status === 'Recovering').length;

  useEffect(() => {
    NotificationService.register();
    // Simulate real-time critical alert after 3s
    const timer = setTimeout(() => {
      dispatch(addNotification({
        title: 'Vitals Alert',
        message: 'Mohammed Ali Khan O2 saturation critical — check ICU-1',
        type: 'alert',
      }));
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const recentActivities = [
    { time: '09:15', event: 'Mohammed Ali Khan admitted to ICU-1', type: 'alert' },
    { time: '08:45', event: 'Lab results ready for Arjun Sharma', type: 'info' },
    { time: '08:30', event: 'Dr. Vikram Singh started rounds', type: 'success' },
    { time: '07:55', event: 'Deepak Nambiar discharge completed', type: 'success' },
    { time: '07:30', event: 'Night shift handover completed', type: 'info' },
  ];

  const actColors: Record<string, string> = {
    alert: 'var(--red)', info: 'var(--blue)', success: 'var(--accent)', warning: 'var(--yellow)'
  };

  return (
    <div style={styles.page} className="animate-in">
      {/* Welcome banner */}
      <div style={styles.banner}>
        <div>
          <h1 style={styles.welcome}>Good morning, {user?.displayName?.split(' ').slice(-1)[0]} 👋</h1>
          <p style={styles.welcomeSub}>Here's what's happening across the facility today.</p>
        </div>
        <div style={styles.bannerBadge}>
          <span className="status-dot dot-stable" />
          <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13 }}>Live Dashboard</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={styles.statsGrid}>
        <StatCard label="Total Patients" value={patients.length} sub="Currently admitted" color="var(--blue)" icon="👥" />
        <StatCard label="Critical" value={criticalCount} sub="Requires immediate care" color="var(--red)" icon="⚠️" />
        <StatCard label="Stable" value={stableCount} sub="Under observation" color="var(--accent)" icon="✓" />
        <StatCard label="Recovering" value={recoveringCount} sub="On treatment plan" color="var(--yellow)" icon="↑" />
      </div>

      <div style={styles.lower}>
        {/* Critical patients */}
        <div className="card" style={{ flex: '1 1 500px' }}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>⚡ Critical Patients</h3>
            <button style={styles.viewAllBtn} onClick={() => navigate('/patients')}>View All →</button>
          </div>
          <div style={styles.patientList}>
            {patients.filter(p => p.status === 'Critical').map(p => (
              <div key={p.id} style={styles.patientRow} onClick={() => navigate(`/patients/${p.id}`)}>
                <div style={styles.patientAvatar}>
                  {p.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.patientName}>{p.name}</div>
                  <div style={styles.patientInfo}>{p.condition} · {p.room}</div>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <div style={styles.vitals}>❤️ {p.vitals.heartRate} bpm</div>
                  <div style={styles.vitals}>O₂ {p.vitals.oxygenSaturation}%</div>
                </div>
                <span className="badge badge-critical">Critical</span>
              </div>
            ))}
            {patients.filter(p => p.status === 'Critical').length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: 16 }}>No critical patients</p>
            )}
          </div>
        </div>

        {/* Activity feed */}
        <div className="card" style={{ flex: '1 1 300px' }}>
          <h3 style={styles.sectionTitle}>📋 Recent Activity</h3>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={styles.activityItem}>
                <div style={{ ...styles.actDot, background: actColors[a.type] || 'var(--blue)' }} />
                <div>
                  <div style={styles.actText}>{a.event}</div>
                  <div style={styles.actTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors on duty */}
      <div className="card">
        <h3 style={{ ...styles.sectionTitle, marginBottom: 20 }}>👨‍⚕️ Doctors On Duty Today</h3>
        <div style={styles.doctorsGrid}>
          {[
            { name: 'Dr. Priya Nair', specialty: 'Cardiology', patients: 3, status: 'Available' },
            { name: 'Dr. Rahul Mehta', specialty: 'Endocrinology', patients: 2, status: 'In Rounds' },
            { name: 'Dr. Anita Gupta', specialty: 'Internal Medicine', patients: 2, status: 'Available' },
            { name: 'Dr. Vikram Singh', specialty: 'Surgery', patients: 2, status: 'In Surgery' },
          ].map(d => (
            <div key={d.name} style={styles.doctorCard}>
              <div style={styles.doctorAvatar}>{d.name.split(' ').map(w => w[0]).slice(1).join('')}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.specialty}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' as const }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.patients} patients</div>
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: d.status === 'Available' ? 'var(--accent)' : d.status === 'In Surgery' ? 'var(--red)' : 'var(--yellow)'
                }}>
                  {d.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },

  banner: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(0,212,170,0.08) 100%)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap', 
    gap: 16
  },

  // banner: {
  //   background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(0,212,170,0.08) 100%)',
  //   border: '1px solid var(--border)',
  //   borderRadius: 'var(--radius-lg)',
  //   padding: '24px 28px',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },

  welcome: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 4 },
  welcomeSub: { color: 'var(--text-secondary)', fontSize: 14 },
  bannerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--accent-dim)',
    border: '1px solid rgba(0,212,170,0.25)',
    borderRadius: 100,
    padding: '8px 16px',
  },
  statsGrid: { display: 'grid', 
    // gridTemplateColumns: 'repeat(4, 1fr)', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16 },
  lower: { display: 'flex',
    flexWrap: 'wrap', 
    gap: 20 },
    
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  patientList: { display: 'flex', flexDirection: 'column', gap: 12 },
  patientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 16px',
    background: 'var(--bg-elevated)',
    borderRadius: 10,
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'border-color 0.2s',
  },
  patientAvatar: {
    width: 36,
    height: 36,
    background: 'var(--red-dim)',
    border: '1px solid rgba(240,86,86,0.3)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--red)',
    flexShrink: 0,
  },
  patientName: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },
  patientInfo: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  vitals: { fontSize: 12, color: 'var(--text-secondary)' },
  activityItem: {
    display: 'flex',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
    alignItems: 'flex-start',
  },
  actDot: { width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0 },
  actText: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 },
  actTime: { fontSize: 11, color: 'var(--text-muted)', marginTop: 3 },
  // doctorsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 },
  doctorsGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Wraps doctor cards
    gap: 12 
  },

  doctorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    background: 'var(--bg-elevated)',
    borderRadius: 10,
    border: '1px solid var(--border)',
  },
  doctorAvatar: {
    width: 38,
    height: 38,
    background: 'var(--blue-dim)',
    border: '1px solid rgba(79,163,232,0.3)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--blue)',
    flexShrink: 0,
  },
};

export default DashboardPage;
