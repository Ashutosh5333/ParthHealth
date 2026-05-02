import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { togglePanel, addNotification } from '../../store/slices/notificationsSlice';
import { setSearchQuery } from '../../store/slices/patientsSlice';
import { NotificationService } from '../../utils/notificationService';

interface Props { onMenuClick: () => void; }

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/patients': 'Patients',
};

export default function Header({ onMenuClick }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const unread = useAppSelector(s =>
    s.notifications.notifications.filter(n => n.unread).length
  );
  const [search, setSearch] = useState('');

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([k]) => location.pathname.startsWith(k))?.[1]
    || 'RAGA Health';

  const handleSearch = (v: string) => {
    setSearch(v);
    dispatch(setSearchQuery(v));
    if (v && !location.pathname.includes('/patients')) navigate('/patients');
  };

  const handleTestAlert = async () => {
    dispatch(addNotification({
      title: 'Test Critical Alert',
      message: 'Manual test alert triggered from header',
      time: 'just now',
      type: 'critical',
      unread: true,
    }));
    await NotificationService.showNotification('RAGA Health Alert', 'Manual test alert triggered');
    dispatch(togglePanel());
  };

  return (
    <>
      {/* Inject responsive CSS for header elements */}
      <style>{`
        .hdr-menu-btn { display: none !important; }
        .hdr-search   { display: flex !important; }
        .hdr-alert    { display: flex !important; }
        @media (max-width: 900px) {
          .hdr-menu-btn { display: flex !important; }
          .hdr-search   { display: none !important; }
        }
        @media (max-width: 600px) {
          .hdr-alert { display: none !important; }
        }
      `}</style>

      <header style={{
        height: 'var(--header)',
        background: 'var(--navy2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        flexShrink: 0,
        position: 'relative',
        zIndex: 50,
      }}>

        {/* Hamburger — CSS controls visibility, not JS */}
        <button
          className="hdr-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
          style={{
            width: 36, height: 36,
            background: 'none',
            border: '1px solid var(--border2)',
            borderRadius: 8,
            cursor: 'pointer',
            color: 'var(--text2)',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Page title */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16, fontWeight: 600,
          color: 'var(--text1)',
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {pageTitle}
        </div>

        {/* Search — hidden on mobile via CSS */}
        <div className="hdr-search" style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search patients..."
            style={{
              width: '100%',
              background: 'var(--navy3)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '7px 12px 7px 34px',
              fontSize: 13,
              color: 'var(--text1)',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--teal)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Alert button — hidden on small screens via CSS */}
          <button
            className="hdr-alert"
            onClick={handleTestAlert}
            style={{
              background: 'var(--red-dim)',
              border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: 8,
              color: 'var(--red)',
              fontSize: 12, fontWeight: 500,
              padding: '0 14px', height: 36,
              cursor: 'pointer',
              alignItems: 'center', gap: 5,
              fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,77,109,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--red-dim)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Test Alert
          </button>

          {/* Notification bell */}
          <button
            onClick={() => dispatch(togglePanel())}
            aria-label="Notifications"
            style={{
              width: 36, height: 36,
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer',
              color: 'var(--text2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 7, height: 7,
                background: 'var(--red)',
                borderRadius: '50%',
                border: '1.5px solid var(--navy2)',
              }} />
            )}
          </button>

          {/* Profile */}
          <button
            aria-label="Profile"
            style={{
              width: 36, height: 36,
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer',
              color: 'var(--text2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}
