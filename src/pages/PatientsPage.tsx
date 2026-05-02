import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setViewMode, setStatusFilter, setSelectedPatient } from '../store/slices/patientsSlice';
import { Patient, StatusFilter, ViewMode } from '../types';

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'Critical' },
  { label: 'Stable', value: 'Stable' },
  { label: 'Recovering', value: 'Recovering' },
  { label: 'Discharged', value: 'Discharged' },
];

function PatientCard({ p, onClick }: { p: Patient; onClick: () => void }) {
  return (
    <div onClick={onClick} className="card" style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div className="avatar" style={{ width: 40, height: 40, background: p.avatar, fontSize: 13 }}>{p.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{p.id} · {p.age}y {p.gender === 'M' ? 'Male' : 'Female'} · {p.bloodType}</div>
        </div>
        <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{p.condition}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>Room: {p.room}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        {[
          { label: 'BP', value: p.vitals.bp, alert: p.status === 'Critical' },
          { label: 'HR', value: `${p.vitals.hr} bpm`, alert: p.vitals.hr > 100 },
          { label: 'SpO₂', value: `${p.vitals.spo2}%`, alert: p.vitals.spo2 < 95 },
          { label: 'Temp', value: `${p.vitals.temp}°C`, alert: p.vitals.temp > 38 },
        ].map(v => (
          <div key={v.label}>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 1 }}>{v.label}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: v.alert ? 'var(--red)' : 'var(--text1)' }}>{v.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientTable({ patients, onSelect }: { patients: Patient[]; onSelect: (id: string) => void }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Patient', 'Condition', 'Status', 'Room', 'BP', 'HR', 'SpO₂'].map(h => (
              <th key={h} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id} onClick={() => onSelect(p.id)} style={{ cursor: 'pointer' }}
              onMouseEnter={e => { Array.from(e.currentTarget.cells).forEach(c => (c.style.background = 'rgba(255,255,255,0.02)')); }}
              onMouseLeave={e => { Array.from(e.currentTarget.cells).forEach(c => (c.style.background = 'none')); }}>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar" style={{ width: 30, height: 30, background: p.avatar, fontSize: 10, flexShrink: 0 }}>{p.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text1)' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{p.id}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.condition}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)' }}>{p.room}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: p.status === 'Critical' ? 'var(--red)' : 'var(--text1)' }}>{p.vitals.bp}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: p.vitals.hr > 100 ? 'var(--amber)' : 'var(--text1)' }}>{p.vitals.hr}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: p.vitals.spo2 < 95 ? 'var(--red)' : 'var(--teal)' }}>{p.vitals.spo2}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { patients, viewMode, statusFilter, searchQuery } = useAppSelector(s => s.patients);

  const filtered = useMemo(() => {
    let list = statusFilter === 'all' ? patients : patients.filter(p => p.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.room.toLowerCase().includes(q)
      );
    }
    return list;
  }, [patients, statusFilter, searchQuery]);

  const handleSelect = (id: string) => {
    dispatch(setSelectedPatient(id));
    navigate(`/patients/${id}`);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Patients</div>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>
          Showing {filtered.length} of {patients.length} patients{searchQuery ? ` matching "${searchQuery}"` : ''}
        </div>
      </div>

      {/* Filters + View toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => dispatch(setStatusFilter(f.value))} style={{
            padding: '6px 14px', borderRadius: 20, border: `1px solid ${statusFilter === f.value ? 'var(--teal)' : 'var(--border)'}`,
            background: statusFilter === f.value ? 'var(--teal-dim)' : 'none',
            color: statusFilter === f.value ? 'var(--teal)' : 'var(--text2)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
          }}>{f.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {(['grid', 'list'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => dispatch(setViewMode(v))} style={{
              padding: '6px 14px', background: viewMode === v ? 'var(--teal-dim)' : 'none',
              border: 'none', color: viewMode === v ? 'var(--teal)' : 'var(--text2)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', transition: 'all 0.2s',
            }}>{v === 'grid' ? '⊞ Grid' : '☰ List'}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 15, color: 'var(--text2)' }}>No patients found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filter</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(p => <PatientCard key={p.id} p={p} onClick={() => handleSelect(p.id)} />)}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <PatientTable patients={filtered} onSelect={handleSelect} />
        </div>
      )}
    </div>
  );
}
