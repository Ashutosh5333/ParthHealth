import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const VITAL_TREND = [88, 92, 90, 95, 93, 97, 95, 98, 96, 97]; // mock SpO2 trend

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = useAppSelector(s => s.patients.patients.find(p => p.id === id));

  if (!patient) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 48 }}>🏥</div>
        <div style={{ fontSize: 16, color: 'var(--text2)' }}>Patient not found</div>
        <button onClick={() => navigate('/patients')} style={{ padding: '10px 20px', background: 'var(--teal-dim)', border: '1px solid var(--teal)', borderRadius: 8, color: 'var(--teal)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Back to Patients</button>
      </div>
    );
  }

  const trendData = VITAL_TREND.map((v, i) => ({ t: `${8 + i}:00`, spo2: v }));
  const COLORS = ['#00d4aa', '#4dabf7', '#ff4d6d', '#ffa94d', '#cc5de8', '#51cf66'];

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 20 }}>
      {/* Back button */}
      <button onClick={() => navigate('/patients')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text2)', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-body)', marginBottom: 16, padding: 0, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}>
        ← Back to Patients
      </button>

      {/* Patient header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="avatar" style={{ width: 60, height: 60, background: patient.avatar, fontSize: 20 }}>{patient.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text1)' }}>{patient.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>
            {patient.id} · {patient.age} years · {patient.gender === 'M' ? 'Male' : 'Female'} · Blood Type: {patient.bloodType}
          </div>
        </div>
        <span className={`badge badge-${patient.status.toLowerCase()}`} style={{ fontSize: 12, padding: '6px 16px' }}>{patient.status}</span>
      </div>

      {/* Detail Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>

        {/* Current Vitals */}
        <div className="card">
          <div className="card-head"><span className="card-title">Current Vitals</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Blood Pressure', value: patient.vitals.bp, unit: 'mmHg', alert: patient.status === 'Critical' },
              { label: 'Heart Rate', value: patient.vitals.hr, unit: 'bpm', alert: patient.vitals.hr > 100 },
              { label: 'SpO₂', value: `${patient.vitals.spo2}%`, unit: 'oxygen saturation', alert: patient.vitals.spo2 < 95 },
              { label: 'Temperature', value: `${patient.vitals.temp}°C`, unit: 'body temp', alert: patient.vitals.temp > 38 },
            ].map(v => (
              <div key={v.label} style={{ background: 'var(--navy4)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: v.alert ? 'var(--red)' : 'var(--teal)' }}>{v.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{v.unit}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="card">
          <div className="card-head"><span className="card-title">Diagnosis & Info</span></div>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text1)', marginBottom: 8 }}>{patient.condition}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Room: <span style={{ color: 'var(--text1)' }}>{patient.room}</span></div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>
            Admitted: <span style={{ color: 'var(--text1)' }}>{new Date(patient.admittedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Allergies</div>
            {patient.allergies.length > 0
              ? patient.allergies.map(a => (
                <span key={a} style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'var(--red-dim)', border: '1px solid rgba(255,77,109,0.3)', color: 'var(--red)', margin: '2px 4px 2px 0' }}>{a}</span>
              ))
              : <span style={{ fontSize: 13, color: 'var(--text3)' }}>No known allergies</span>
            }
          </div>
        </div>

        {/* Medications */}
        <div className="card">
          <div className="card-head"><span className="card-title">Active Medications</span></div>
          {patient.medications.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < patient.medications.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text1)' }}>{m.name} <span style={{ color: 'var(--text2)', fontWeight: 400 }}>{m.dose}</span></div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{m.frequency}</div>
              </div>
              <span className="badge badge-stable" style={{ fontSize: 9 }}>Active</span>
            </div>
          ))}
        </div>

        {/* Clinical Timeline */}
        <div className="card">
          <div className="card-head"><span className="card-title">Clinical Timeline</span></div>
          {patient.timeline.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < patient.timeline.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap', minWidth: 90, flexShrink: 0 }}>{t.time}</div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 3 }} />
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.4 }}>{t.event}</div>
            </div>
          ))}
        </div>

        {/* SpO2 trend chart */}
        <div className="card" style={{ gridColumn: 'span 2' } as any}>
          <div className="card-head"><span className="card-title">SpO₂ Trend (Today)</span></div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" tick={{ fill: '#4a6080', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[85, 100]} tick={{ fill: '#4a6080', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ background: 'var(--navy3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text1)' }} formatter={(v: number) => [`${v}%`, 'SpO₂']} />
              <Line type="monotone" dataKey="spo2" stroke="var(--teal)" strokeWidth={2} dot={{ fill: 'var(--teal)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
