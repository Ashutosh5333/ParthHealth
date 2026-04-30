import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { togglePanel, markAllRead, closePanel } from '../../store/slices/notificationsSlice';
import { NotificationService } from '../../utils/notificationService';
import { addNotification } from '../../store/slices/notificationsSlice';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/patients': 'Patient Management',
};

const Header: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { notifications, panelOpen } = useAppSelector(s => s.notifications);
  const { user } = useAppSelector(s => s.auth);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;
  const title = pageTitles[location.pathname] || 'Dashboard';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        dispatch(closePanel());
      }
    };
    if (panelOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [panelOpen, dispatch]);

  const handleTestNotification = async () => {
    const notif = {
      title: 'Critical Alert',
      message: 'Patient P001 heart rate spiked to 135 bpm',
      type: 'alert' as const,
    };
    dispatch(addNotification(notif));
    await NotificationService.showLocalNotification(notif.title, notif.message, notif.type);
  };

  const typeColors: Record<string, string> = {
    alert: 'var(--red)',
    warning: 'var(--yellow)',
    success: 'var(--accent)',
    info: 'var(--blue)',
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      
        <button 
          onClick={onMenuClick} 
          style={styles.menuToggle}
          className="mobile-only"
        >
          ☰
        </button>
        
        <div style={styles.titleArea}>
          <h2 style={styles.title}>{title}</h2>
       
          <div style={{...styles.breadcrumb, display: window.innerWidth < 480 ? 'none' : 'block'}}>
            {user?.displayName} · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>

    
      <div style={styles.actions}>
        <button style={styles.testBtn} onClick={handleTestNotification} title="Trigger test notification">
          {/* ⚡ Test Alert */}
          {window.innerWidth <= 768 ? '⚡' : '⚡ Test Alert'}
        </button>

        <div style={{ position: 'relative' }} ref={panelRef}>
          <button style={styles.bellBtn} onClick={() => dispatch(togglePanel())}>
            🔔
            {unread > 0 && (
              <span style={styles.badge}>{unread > 9 ? '9+' : unread}</span>
            )}
          </button>

          {panelOpen && (
            <div style={styles.panel} className="animate-in">
              <div style={styles.panelHeader}>
                <span style={styles.panelTitle}>Notifications</span>
                {unread > 0 && (
                  <button style={styles.markAllBtn} onClick={() => dispatch(markAllRead())}>
                    Mark all read
                  </button>
                )}
              </div>
              <div style={styles.notifList}>
                {notifications.length === 0 ? (
                  <div style={styles.emptyNotif}>No notifications</div>
                ) : (
                  notifications.slice(0, 8).map(n => (
                    <div key={n.id} style={{
                      ...styles.notifItem,
                      background: n.read ? 'transparent' : 'rgba(0,212,170,0.05)',
                    }}>
                      <div style={{ ...styles.notifDot, background: typeColors[n.type] || 'var(--blue)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={styles.notifTitle}>{n.title}</div>
                        <div style={styles.notifMsg}>{n.message}</div>
                        <div style={styles.notifTime}>{formatTime(n.timestamp)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: 'var(--header-h)',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: '0 32px',
    padding: window.innerWidth <= 768 ? '0 16px' : '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  hamburger: {
    display: window.innerWidth > 1024 ? 'none' : 'flex',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    cursor: 'pointer',
    color: 'var(--text-primary)',
  },
  menuToggle: {
    display: window.innerWidth <= 768 ? 'block' : 'none',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    padding: 0
  },
  titleArea: { display: 'flex', flexDirection: 'column', gap: 2 },
  title: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px' },
  breadcrumb: { fontSize: 12, color: 'var(--text-muted)' },
  actions: { display: 'flex', alignItems: 'center', gap: 12 },
  testBtn: {
    padding: '7px 14px',
    background: 'var(--yellow-dim)',
    border: '1px solid rgba(245,166,35,0.3)',
    borderRadius: 8,
    color: 'var(--yellow)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  bellBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    background: 'var(--red)',
    borderRadius: '50%',
    fontSize: 9,
    fontWeight: 700,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    // right: 0,
    // width: 360,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    boxShadow: 'var(--shadow)',
    overflow: 'hidden',
    width: window.innerWidth <= 400 ? 'calc(100vw - 32px)' : 360, // Full width on tiny screens
    right: window.innerWidth <= 400 ? -16 : 0,
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 18px',
    borderBottom: '1px solid var(--border)',
  },
  panelTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 },
  markAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  notifList: { maxHeight: 380, overflowY: 'auto' as const },
  notifItem: {
    display: 'flex',
    gap: 12,
    padding: '14px 18px',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.2s',
  },
  notifDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5 },
  notifTitle: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 },
  notifMsg: { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 },
  notifTime: { fontSize: 11, color: 'var(--text-muted)', marginTop: 4 },
  emptyNotif: { padding: 32, textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 14 },
};

export default Header;
