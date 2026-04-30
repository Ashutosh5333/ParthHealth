import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

const VitalCard: React.FC<{ icon: string; label: string; value: string; unit: string; color: string; alert?: boolean }> = ({ icon, label, value, unit, color, alert }) => (
  <div style={{
    background: 'var(--bg-elevated)',
    border: `1px solid ${alert ? 'rgba(240,86,86,0.4)' : 'var(--border)'}`,
    borderRadius: 12,
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    position: 'relative' as const,
    overflow: 'hidden',
  }}>
    {alert && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--red)' }} />}
    <div style={{ fontSize: 22 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color }}>{value}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unit}</span>
      </div>
    </div>
    {alert && <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>⚠ Abnormal</span>}
  </div>
);

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients } = useAppSelector(s => s.patients);
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Patient Not Found</h2>
        <button style={styles.backBtn} onClick={() => navigate('/patients')}>← Back to Patients</button>
      </div>
    );
  }

  const statusBgMap: Record<string, string> = {
    Critical: 'badge-critical', Stable: 'badge-stable', Recovering: 'badge-recovering', Discharged: 'badge-discharged'
  };

  const isCriticalHR = patient.vitals.heartRate > 100 || patient.vitals.heartRate < 60;
  const isCriticalO2 = patient.vitals.oxygenSaturation < 95;
  const isCriticalTemp = patient.vitals.temperature > 38 || patient.vitals.temperature < 36;

  return (
    <div style={styles.page} className="animate-in">
      {/* Back + header */}
      <div style={styles.topRow}>
        <button style={styles.backBtn} onClick={() => navigate('/patients')}>← Back</button>
        <div style={styles.patientHeader}>
          <div style={styles.bigAvatar}>{patient.name.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
              <h1 style={styles.patientName}>{patient.name}</h1>
              <span className={`badge ${statusBgMap[patient.status]}`}>
                <span className={`status-dot dot-${patient.status.toLowerCase()}`} />
                {patient.status}
              </span>
            </div>
            <div style={styles.patientMeta}>
              {patient.id} · {patient.age} years old · {patient.gender} · Blood Type: <strong>{patient.bloodType}</strong>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.infoChip}>🏥 {patient.room}</div>
            <div style={styles.infoChip}>👨‍⚕️ {patient.doctor}</div>
          </div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Vitals */}
          <div className="card">
            <h3 style={styles.sectionTitle}>📊 Current Vitals</h3>
            <div style={styles.vitalsGrid}>
              <VitalCard icon="❤️" label="Heart Rate" value={String(patient.vitals.heartRate)} unit="bpm" color={isCriticalHR ? 'var(--red)' : 'var(--accent)'} alert={isCriticalHR} />
              <VitalCard icon="🩺" label="Blood Pressure" value={patient.vitals.bloodPressure} unit="mmHg" color="var(--blue)" />
              <VitalCard icon="🌡" label="Temperature" value={String(patient.vitals.temperature)} unit="°C" color={isCriticalTemp ? 'var(--yellow)' : 'var(--accent)'} alert={isCriticalTemp} />
              <VitalCard icon="💨" label="O₂ Saturation" value={String(patient.vitals.oxygenSaturation)} unit="%" color={isCriticalO2 ? 'var(--red)' : 'var(--accent)'} alert={isCriticalO2} />
            </div>
          </div>

          {/* Medications */}
          <div className="card">
            <h3 style={styles.sectionTitle}>💊 Current Medications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {patient.medications.map((med, i) => (
                <div key={i} style={styles.medItem}>
                  <span style={styles.medDot}>●</span>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{med}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="card">
            <h3 style={styles.sectionTitle}>⚠️ Allergies</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginTop: 12 }}>
              {patient.allergies.length === 0 ? (
                <span style={{ color: 'var(--accent)', fontSize: 14 }}>✓ No known allergies</span>
              ) : patient.allergies.map((a, i) => (
                <span key={i} style={styles.allergyTag}>{a}</span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h3 style={styles.sectionTitle}>📝 Clinical Notes</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 8 }}>{patient.notes}</p>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Contact info */}
          <div className="card">
            <h3 style={styles.sectionTitle}>👤 Patient Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
              {[
                { label: 'Phone', value: patient.phone, icon: '📞' },
                { label: 'Email', value: patient.email, icon: '✉️' },
                { label: 'Insurance', value: patient.insurance, icon: '🛡' },
                { label: 'Condition', value: patient.condition, icon: '🩺' },
              ].map(item => (
                <div key={item.label} style={styles.infoRow}>
                  <span style={styles.infoLabel}>{item.icon} {item.label}</span>
                  <span style={styles.infoValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 style={styles.sectionTitle}>📅 Appointment Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              {[
                { label: 'Admission Date', value: patient.admissionDate, icon: '🏥', color: 'var(--blue)' },
                { label: 'Last Visit', value: patient.lastVisit, icon: '✓', color: 'var(--accent)' },
                { label: 'Next Appointment', value: patient.nextAppointment, icon: '📆', color: 'var(--yellow)' },
              ].map(t => (
                <div key={t.label} style={styles.timelineItem}>
                  <div style={{ ...styles.timelineDot, background: t.color }} />
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                      {new Date(t.value).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <h3 style={styles.sectionTitle}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                { label: 'Order Lab Tests', icon: '🔬', color: 'var(--blue)' },
                { label: 'Update Medication', icon: '💊', color: 'var(--accent)' },
                { label: 'Schedule Follow-up', icon: '📅', color: 'var(--purple)' },
                { label: 'Generate Report', icon: '📄', color: 'var(--yellow)' },
              ].map(a => (
                <button key={a.label} style={{ ...styles.actionBtn, borderColor: `${a.color}33`, color: a.color }}>
                  <span>{a.icon}</span> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  topRow: { display: 'flex', flexDirection: 'column', gap: 16 },
  backBtn: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 16px',
    color: 'var(--text-secondary)',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    alignSelf: 'flex-start',
    transition: 'all 0.2s',
  },
  patientHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    flexWrap: 'wrap' as const,
  },
  bigAvatar: {
    width: 64,
    height: 64,
    background: 'var(--blue-dim)',
    border: '2px solid rgba(79,163,232,0.3)',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--blue)',
    flexShrink: 0,
  },
  patientName: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.5px' },
  patientMeta: { fontSize: 14, color: 'var(--text-muted)', marginTop: 4 },
  headerRight: { marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' },
  infoChip: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 13,
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap' as const,
  },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 },
  vitalsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 16 },
  medItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8 },
  medDot: { color: 'var(--accent)', fontSize: 8 },
  allergyTag: {
    padding: '5px 14px',
    background: 'var(--red-dim)',
    border: '1px solid rgba(240,86,86,0.3)',
    borderRadius: 100,
    fontSize: 13,
    color: 'var(--red)',
  },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14 },
  infoLabel: { fontSize: 13, color: 'var(--text-muted)' },
  infoValue: { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right' as const },
  timelineItem: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  timelineDot: { width: 10, height: 10, borderRadius: '50%', marginTop: 6, flexShrink: 0 },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'background 0.2s',
  },
};

export default PatientDetailPage;
