import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { markAllRead, closePanel } from '../../store/slices/notificationsSlice';
import Sidebar from './Sidebar';
import Header from './Header';

// ── Responsive hook — updates on every resize, no refresh needed ──────────────
function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    // Modern API
    mq.addEventListener('change', handler);
    // Sync on mount in case SSR or initial mismatch
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

export default function AppLayout() {
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);
  const { notifications, panelOpen } = useAppSelector(s => s.notifications);
  const dispatch = useAppDispatch();

  const isMobile = useIsMobile(900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), []);

  if (!isAuth) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Mobile: sidebar backdrop ── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 90,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Sidebar ──
          Desktop → participates in flex layout (position: relative, always visible)
          Mobile  → fixed overlay, slides in/out via transform
      ── */}
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        top: 0, left: 0,
        height: '100vh',
        zIndex: 100,
        // Only apply slide transform on mobile
        transform: isMobile
          ? sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
          : 'translateX(0)',
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        // On desktop the div itself occupies space; on mobile it's fixed so it doesn't
        width: isMobile ? 'var(--sidebar)' : 'auto',
        flexShrink: 0,
      }}>
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <Header onMenuClick={toggleSidebar} />
        <main style={{ flex: 1, overflow: 'hidden' }}>
          <Outlet />
        </main>
      </div>

      {/* ── Notification panel backdrop ── */}
      {panelOpen && (
        <div
          onClick={() => dispatch(closePanel())}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 150 }}
        />
      )}

      {/* ── Notification slide-in panel ── */}
      <div style={{
        position: 'fixed', top: 0,
        right: panelOpen ? 0 : -360,
        width: 'min(340px, 100vw)',
        height: '100vh',
        background: 'var(--navy2)',
        borderLeft: '1px solid var(--border)',
        zIndex: 200,
        display: 'flex', flexDirection: 'column',
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: panelOpen ? '-4px 0 24px rgba(0,0,0,0.4)' : 'none',
      }}>
        {/* Panel header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
            Notifications
          </div>
          <button
            onClick={() => dispatch(closePanel())}
            style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 0 }}
          >×</button>
        </div>

        {/* Notification list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 13 }}>
              No notifications
            </div>
          )}
          {notifications.map(n => {
            const accentColor =
              n.type === 'critical' ? 'var(--red)'
              : n.type === 'warning' ? 'var(--amber)'
              : n.type === 'success' ? 'var(--green)'
              : 'var(--teal)';
            return (
              <div key={n.id} style={{
                padding: 12, borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                border: `1px solid ${n.unread ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`,
                borderLeft: `3px solid ${accentColor}`,
                background: n.unread ? 'rgba(255,255,255,0.03)' : 'none',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = n.unread ? 'rgba(255,255,255,0.03)' : 'none')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text1)', marginBottom: 3 }}>{n.title}</div>
                  {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor, flexShrink: 0, marginTop: 3 }} />}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{n.message}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{n.time}</div>
              </div>
            );
          })}
        </div>

        {/* Panel footer */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button
            onClick={() => dispatch(markAllRead())}
            style={{
              width: '100%', padding: 10,
              background: 'var(--teal-dim)',
              border: '1px solid rgba(0,212,170,0.3)',
              borderRadius: 8, color: 'var(--teal)',
              fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--teal-glow)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--teal-dim)')}
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}
