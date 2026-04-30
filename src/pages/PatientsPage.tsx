import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setViewMode, setSearchQuery, setStatusFilter } from '../store/slices/patientsSlice';
import { Patient } from '../types';


const ResponsiveStyles = () => (
  <style>{`
    @media (max-width: 768px) {
      /* Stack Top Bar */
      .top-bar-res {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 20px !important;
      }
      
      .controls-res {
        width: 100% !important;
        flex-direction: column !important;
        align-items: stretch !important;
      }

      .search-wrap-res {
        width: 100% !important;
      }

      .search-input-res {
        width: 100% !important;
      }

      /* Handle Table Overflow */
      .table-container-res {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch;
      }

      .table-res {
        min-width: 800px; /* Prevents text squishing */
      }
      
      /* Grid adjustments */
      .grid-res {
        grid-template-columns: 1fr !important;
      }
    }
  `}</style>
);

const StatusBadge: React.FC<{ status: Patient['status'] }> = ({ status }) => {
  const cls = {
    Critical: 'badge-critical',
    Stable: 'badge-stable',
    Recovering: 'badge-recovering',
    Discharged: 'badge-discharged',
  }[status];
  const dot = {
    Critical: 'dot-critical',
    Stable: 'dot-stable',
    Recovering: 'dot-recovering',
    Discharged: 'dot-discharged',
  }[status];
  return (
    <span className={`badge ${cls}`}>
      <span className={`status-dot ${dot}`} />
      {status}
    </span>
  );
};

const PatientGridCard: React.FC<{ patient: Patient; onClick: () => void }> = ({ patient, onClick }) => (
  <div style={gridStyles.card} className="card" onClick={onClick}>
    <div style={gridStyles.top}>
      <div style={gridStyles.avatar}>{patient.name.charAt(0)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={gridStyles.name}>{patient.name}</div>
        <div style={gridStyles.id}>{patient.id} · {patient.age}y · {patient.gender}</div>
      </div>
      <StatusBadge status={patient.status} />
    </div>

    <div style={gridStyles.condition}>{patient.condition}</div>

    <div style={gridStyles.meta}>
      <div style={gridStyles.metaItem}>
        <span style={gridStyles.metaLabel}>Doctor</span>
        <span style={gridStyles.metaVal}>{patient.doctor.replace('Dr. ', '')}</span>
      </div>
      <div style={gridStyles.metaItem}>
        <span style={gridStyles.metaLabel}>Room</span>
        <span style={gridStyles.metaVal}>{patient.room}</span>
      </div>
      <div style={gridStyles.metaItem}>
        <span style={gridStyles.metaLabel}>Blood</span>
        <span style={gridStyles.metaVal}>{patient.bloodType}</span>
      </div>
    </div>

    <div style={gridStyles.vitals}>
      <div style={gridStyles.vital}>
        <span>❤️</span>
        <span>{patient.vitals.heartRate}</span>
        <span style={gridStyles.vitalLabel}>bpm</span>
      </div>
      <div style={gridStyles.vital}>
        <span>🩺</span>
        <span>{patient.vitals.bloodPressure}</span>
        <span style={gridStyles.vitalLabel}>mmHg</span>
      </div>
      <div style={gridStyles.vital}>
        <span>🌡</span>
        <span>{patient.vitals.temperature}</span>
        <span style={gridStyles.vitalLabel}>°C</span>
      </div>
      <div style={gridStyles.vital}>
        <span>💨</span>
        <span>{patient.vitals.oxygenSaturation}</span>
        <span style={gridStyles.vitalLabel}>%</span>
      </div>
    </div>
  </div>
);

const gridStyles: Record<string, React.CSSProperties> = {
  card: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    transition: 'transform 0.2s, border-color 0.2s',
  },
  top: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  avatar: {
    width: 42,
    height: 42,
    background: 'var(--blue-dim)',
    border: '1px solid rgba(79,163,232,0.25)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--blue)',
    flexShrink: 0,
  },
  name: { fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 },
  id: { fontSize: 12, color: 'var(--text-muted)' },
  condition: { fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' },
  meta: { display: 'flex', gap: 16 },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  metaLabel: { fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  metaVal: { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' },
  vitals: {
    display: 'flex',
    gap: 8,
    background: 'var(--bg-elevated)',
    borderRadius: 8,
    padding: '10px 12px',
    justifyContent: 'space-around',
    borderTop: '1px solid var(--border)',
    marginTop: 4,
  },
  vital: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' },
  vitalLabel: { fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 },
};

const PatientListRow: React.FC<{ patient: Patient; onClick: () => void }> = ({ patient, onClick }) => (
  <tr style={listStyles.row} onClick={onClick}>
    <td style={listStyles.td}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={listStyles.avatar}>{patient.name.charAt(0)}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{patient.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{patient.id}</div>
        </div>
      </div>
    </td>
    <td style={listStyles.td}><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{patient.age} · {patient.gender}</span></td>
    <td style={listStyles.td}><span style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{patient.condition}</span></td>
    <td style={listStyles.td}><StatusBadge status={patient.status} /></td>
    <td style={listStyles.td}><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{patient.doctor}</span></td>
    <td style={listStyles.td}><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{patient.room}</span></td>
    <td style={listStyles.td}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        ❤️ {patient.vitals.heartRate} · O₂ {patient.vitals.oxygenSaturation}%
      </div>
    </td>
  </tr>
);

const listStyles: Record<string, React.CSSProperties> = {
  row: {
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  td: { padding: '14px 16px', verticalAlign: 'middle' as const },
  avatar: {
    width: 32,
    height: 32,
    background: 'var(--blue-dim)',
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--blue)',
    flexShrink: 0,
  },
};

const PatientsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { patients, viewMode, searchQuery, statusFilter } = useAppSelector(s => s.patients);

  const filtered = useMemo(() => {
    return patients.filter(p => {
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  const filters = ['All', 'Critical', 'Stable', 'Recovering', 'Discharged'] as const;

  return (
    <div style={styles.page} className="animate-in">
      <ResponsiveStyles />
      
      {/* Top bar */}
      <div style={styles.topBar} className="top-bar-res">
        <div>
          <h2 style={styles.title}>Patient Registry</h2>
          <p style={styles.sub}>{filtered.length} of {patients.length} patients</p>
        </div>
        <div style={styles.controls} className="controls-res">
          {/* Search */}
          <div style={styles.searchWrap} className="search-wrap-res">
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, ID, condition…"
              value={searchQuery}
              onChange={e => dispatch(setSearchQuery(e.target.value))}
              style={styles.searchInput}
              className="search-input-res"
            />
          </div>

          {/* View toggle */}
          <div style={styles.toggleGroup}>
            <button
              style={{ ...styles.toggleBtn, ...(viewMode === 'grid' ? styles.toggleActive : {}) }}
              onClick={() => dispatch(setViewMode('grid'))}
              title="Grid View"
            >
              ⊞ Grid
            </button>
            <button
              style={{ ...styles.toggleBtn, ...(viewMode === 'list' ? styles.toggleActive : {}) }}
              onClick={() => dispatch(setViewMode('list'))}
              title="List View"
            >
              ☰ List
            </button>
          </div>
        </div>
      </div>

      {/* Status filter pills */}
      <div style={styles.filterRow}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => dispatch(setStatusFilter(f))}
            style={{
              ...styles.filterPill,
              ...(statusFilter === f ? styles.filterActive : {}),
            }}
          >
            {f}
            <span style={styles.filterCount}>
              {f === 'All' ? patients.length : patients.filter(p => p.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={styles.grid} className="grid-res">
          {filtered.map(p => (
            <PatientGridCard key={p.id} patient={p} onClick={() => navigate(`/patients/${p.id}`)} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card table-container-res" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={styles.table} className="table-res">
            <thead>
              <tr style={styles.thead}>
                {['Patient', 'Age / Gender', 'Condition', 'Status', 'Doctor', 'Room', 'Vitals'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <PatientListRow key={p.id} patient={p} onClick={() => navigate(`/patients/${p.id}`)} />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={styles.empty}>No patients found matching your search.</div>
          )}
        </div>
      )}

      {filtered.length === 0 && viewMode === 'grid' && (
        <div style={styles.empty}>No patients found matching your search criteria.</div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' as const, gap: 16 },
  title: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 },
  sub: { fontSize: 13, color: 'var(--text-muted)', marginTop: 2 },
  controls: { display: 'flex', gap: 12, alignItems: 'center' },
  searchWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 12, fontSize: 14, pointerEvents: 'none' as const },
  searchInput: {
    padding: '9px 14px 9px 36px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: 14,
    width: 260,
    outline: 'none',
    fontFamily: 'var(--font-body)',
  },
  toggleGroup: {
    display: 'flex',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
  },
  toggleBtn: {
    padding: '9px 16px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s',
  },
  toggleActive: {
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
  },
  filterRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const },
  filterPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 100,
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  },
  filterActive: {
    background: 'var(--accent-dim)',
    borderColor: 'rgba(0,212,170,0.4)',
    color: 'var(--accent)',
  },
  filterCount: {
    background: 'var(--bg-elevated)',
    borderRadius: 100,
    padding: '1px 6px',
    fontSize: 11,
    fontWeight: 700,
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  thead: { background: 'var(--bg-elevated)' },
  th: {
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  empty: {
    padding: 48,
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
    fontSize: 15,
  },
};

export default PatientsPage;