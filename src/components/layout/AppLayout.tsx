import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAppSelector(s => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <Header />
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    marginLeft: 'var(--sidebar-w)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minWidth: 0,
  },
  content: {
    flex: 1,
    padding: '32px',
    overflowX: 'hidden',
  },
};

export default AppLayout;
