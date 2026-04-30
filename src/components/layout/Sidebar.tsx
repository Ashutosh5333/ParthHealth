import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';

const navItems = [
  { to: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { to: '/analytics', icon: '◈', label: 'Analytics' },
  { to: '/patients', icon: '✦', label: 'Patients' },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(s => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const roleColors: Record<string, string> = {
    admin: 'var(--accent)',
    doctor: 'var(--blue)',
    nurse: 'var(--purple)',
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="9" y="1" width="2" height="18" rx="1" fill="white"/>
            <rect x="1" y="9" width="18" height="2" rx="1" fill="white"/>
            <circle cx="10" cy="10" r="4" fill="none" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
        <div>
          <div style={styles.logoText}>RAGA</div>
          <div style={styles.logoVersion}>Health Platform</div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Navigation</div>
        <nav style={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={styles.bottom}>
        <div style={styles.divider} />
        <div style={styles.userCard}>
          <div style={{ ...styles.avatar, background: roleColors[user?.role || 'admin'] || 'var(--accent)' }}>
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.displayName}</div>
            <div style={{ ...styles.userRole, color: roleColors[user?.role || 'admin'] }}>
              {user?.role?.toUpperCase()}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span>⏻</span> Logout
        </button>
      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  // sidebar: {
  //   width: 'var(--sidebar-w)',
  //   height: '100vh',
  //   background: 'var(--bg-secondary)',
  //   borderRight: '1px solid var(--border)',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   position: 'fixed',
  //   left: 0,
  //   top: 0,
  //   zIndex: 100,
  //   padding: '24px 0',
  // },

  sidebar: {
    // Change width to a fixed value or 0 if hidden
    width: 'var(--sidebar-w)', 
    height: '100vh',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 100,
    padding: '24px 0',
    transition: 'transform 0.3s ease',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 24px 24px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 24,
  },
  logoIcon: {
    width: 40,
    height: 40,
    background: 'var(--accent)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: 2,
    color: 'var(--text-primary)',
  },
  logoVersion: { fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 },
  section: { flex: 1, padding: '0 12px' },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    padding: '0 12px',
    marginBottom: 8,
  },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s',
    marginLeft: -2,
  },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center' as const, flexShrink: 0 },
  bottom: { padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 12 },
  divider: { height: 1, background: 'var(--border)', margin: '0 12px 4px' },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    background: 'var(--bg-card)',
    borderRadius: 10,
    border: '1px solid var(--border)',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 700,
    color: '#051a14',
    flexShrink: 0,
  },
  userInfo: { minWidth: 0, flex: 1 },
  userName: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: 10, fontWeight: 700, letterSpacing: 1 },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 14px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text-muted)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
    width: '100%',
  },
};

export default Sidebar;
