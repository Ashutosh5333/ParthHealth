import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';

interface Props { onClose?: () => void; }

const NAV_MAIN = [
  { to: '/dashboard', label: 'Dashboard', d: 'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z' },
  { to: '/analytics', label: 'Analytics', d: 'M22 12l-4 0-3 9L9 3l-3 9H2' },
];

export default function Sidebar({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
    if (onClose) onClose();
  };

  const navStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', 
    color: isActive ? 'var(--teal)' : 'var(--text2)',
    fontSize: 13.5,
    textDecoration: 'none',
    background: isActive ? 'var(--teal-dim)' : 'none',
    borderLeft: `2px solid ${isActive ? 'var(--teal)' : 'transparent'}`,
    transition: 'all 0.2s',
    cursor: 'pointer',
  });

  return (
    <nav style={{
      width: 'var(--sidebar)', 
      minWidth: 'var(--sidebar)', 
      height: '100dvh', 
      background: 'var(--navy2)', 
      borderRight: '1px solid var(--border)',
      display: 'flex', 
      flexDirection: 'column',
    }}>
      {/* Logo Section */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, background: 'var(--teal)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#050b14">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 4a1.5 1.5 0 0 1 1.5 1.5v3h3a1.5 1.5 0 0 1 0 3h-3v3a1.5 1.5 0 0 1-3 0v-3h-3a1.5 1.5 0 0 1 0-3h3v-3A1.5 1.5 0 0 1 12 6z"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text1)' }}>
          RAGA <span style={{ color: 'var(--teal)' }}>Health</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ padding: '8px 16px 4px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', fontWeight: 500 }}>Main</div>
        {NAV_MAIN.map(n => (
          <NavLink key={n.to} to={n.to} onClick={onClose} style={({ isActive }) => navStyle(isActive)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={n.d}/></svg>
            {n.label}
          </NavLink>
        ))}

        <div style={{ padding: '8px 16px 4px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', fontWeight: 500, marginTop: 4 }}>Patients</div>
        <NavLink to="/patients" onClick={onClose} style={({ isActive }) => navStyle(isActive)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Patients
          <span style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 10 }}>2</span>
        </NavLink>

        <div style={{ padding: '8px 16px 4px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', fontWeight: 500, marginTop: 4 }}>System</div>
        {[
          { label: 'Reports', d: 'M18 20V10M12 20V4M6 20v-6' },
          { label: 'Settings', d: 'M12 2a10 10 0 0 1 0 20M12 2a10 10 0 0 0 0 20M2 12h20' },
        ].map(item => (
          <div key={item.label} style={{ ...navStyle(false), cursor: 'not-allowed', opacity: 0.5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.d}/></svg>
            {item.label}
          </div>
        ))}
      </div>

      {/* User + Logout Section */}
      <div style={{ 
        padding: '16px 16px calc(16px + env(safe-area-inset-bottom))', 
        borderTop: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10, 
        flexShrink: 0,
        background: 'var(--navy2)'
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--teal), var(--blue))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, color: 'var(--navy)', flexShrink: 0,
        }}>
          {(user?.displayName || user?.email)?.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.displayName || user?.email?.split('@')[0]}
          </div>
          <div style={{ fontSize: 10, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user?.role || 'Staff'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{ 
            background: 'rgba(255, 77, 109, 0.1)', 
            border: 'none', 
            color: 'var(--red)', 
            cursor: 'pointer', 
            padding: '8px', 
            borderRadius: 8, 
            transition: 'all 0.2s', 
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}