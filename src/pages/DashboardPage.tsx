import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSelectedPatient } from '../store/slices/patientsSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { ANALYTICS_DATA, DOCTORS, ACTIVITY_FEED } from '../utils/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const StatCard = ({ label, value, color, delta, deltaUp }: { label: string; value: string | number; color: string; delta: string; deltaUp: boolean }) => (
  <div style={{ background: 'var(--navy3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderRadius: '50%', background: `${color}22`, transform: 'translate(20px,-20px)' }} />
    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 8 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, marginTop: 6, color: deltaUp ? 'var(--green)' : 'var(--red)' }}>{delta}</div>
  </div>
);

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const patients = useAppSelector(s => s.patients.patients);
  const user = useAppSelector(s => s.auth.user);

  const critical = patients.filter(p => p.status === 'Critical');
  const weekData = ANALYTICS_DATA.weekly.labels.map((l, i) => ({ day: l, admissions: ANALYTICS_DATA.weekly.admissions[i] }));

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(addNotification({ title: 'Auto Alert', message: 'Critical vitals change detected in ICU-3 (Arjun Sharma)', time: 'just now', type: 'critical', unread: true }));
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const handlePatient = (id: string) => {
    dispatch(setSelectedPatient(id));
    navigate(`/patients/${id}`);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 20 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>
          Good morning, {user?.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — {critical.length} critical patient{critical.length !== 1 ? 's' : ''} need attention
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Patients" value="248" color="var(--teal)" delta="↑ 12 this week" deltaUp />
        <StatCard label="Critical" value={critical.length} color="var(--red)" delta="↑ 1 since yesterday" deltaUp={false} />
        <StatCard label="Bed Occupancy" value="84%" color="var(--blue)" delta="↑ 3% vs last week" deltaUp />
        <StatCard label="Avg Wait (min)" value="14" color="var(--amber)" delta="↓ 3 min improved" deltaUp />
        <StatCard label="Docs on Duty" value="7" color="var(--purple)" delta="2 more from 2PM" deltaUp />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Admission chart */}
        <div className="card" style={{ gridColumn: 'span 2' } as any}>
          <div className="card-head">
            <span className="card-title">Weekly Admissions</span>
            <button className="card-action" onClick={() => navigate('/analytics')}>Full Analytics →</button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--navy3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text1)' }} />
              <Area type="monotone" dataKey="admissions" stroke="#00d4aa" strokeWidth={2} fill="url(#admGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Critical Patients */}
        <div className="card">
          <div className="card-head">
            <span className="card-title">Critical Patients</span>
            <button className="card-action" onClick={() => navigate('/patients')}>View All →</button>
          </div>
          {critical.map(p => (
            <div key={p.id} onClick={() => handlePatient(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 8, cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              <div className="avatar" style={{ width: 36, height: 36, background: p.avatar, fontSize: 12 }}>{p.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{p.condition}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className="badge badge-critical">Critical</span>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{p.room}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="card">
          <div className="card-head"><span className="card-title">Activity Feed</span></div>
          {ACTIVITY_FEED.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 5 }} />
              <div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: a.text.replace(/<strong>/g, '<strong style="color:var(--text1);font-weight:500">') }} />
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Doctors on Duty */}
        <div className="card">
          <div className="card-head"><span className="card-title">Doctors on Duty</span></div>
          {DOCTORS.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < DOCTORS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.status === 'online' ? 'var(--green)' : 'var(--amber)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text1)' }}>{d.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{d.dept}</div>
              </div>
              <span className={`badge badge-${d.status}`}>{d.status}</span>
            </div>
          ))}
        </div>

        {/* Dept Occupancy */}
        <div className="card">
          <div className="card-head"><span className="card-title">Dept. Occupancy</span></div>
          {ANALYTICS_DATA.departments.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', width: 72, flexShrink: 0 }}>{d.name}</div>
              <div style={{ flex: 1, background: 'var(--navy4)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${d.value + 30}%`, height: '100%', background: d.color, borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text1)', width: 36, textAlign: 'right' }}>{d.value + 30}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
