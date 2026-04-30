import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { mockAnalytics } from '../utils/mockData';

const ResponsiveStyles = () => (
  <style>{`
    @media (max-width: 1024px) {
      .kpi-grid-res { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 768px) {
      .kpi-grid-res { grid-template-columns: 1fr !important; }
      .flex-row-res { flex-direction: column !important; }
      .flex-row-res > div { flex: none !important; width: 100% !important; }
    }
  `}</style>
);

const SectionTitle: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>{children}</h3>
    {sub && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</p>}
  </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' && p.name?.toLowerCase().includes('revenue') ? `₹${p.value}L` : p.value}
        </div>
      ))}
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const { admissions, departments, outcomes, revenue } = mockAnalytics;

  const kpis = [
    { label: 'Avg Length of Stay', value: '4.2 days', trend: '-0.3', up: true, color: 'var(--accent)' },
    { label: 'Bed Occupancy Rate', value: '82%', trend: '+5%', up: true, color: 'var(--blue)' },
    { label: 'Patient Satisfaction', value: '4.7 / 5', trend: '+0.2', up: true, color: 'var(--purple)' },
    { label: 'Readmission Rate', value: '3.1%', trend: '-0.8%', up: false, color: 'var(--yellow)' },
  ];

  return (
    <div style={styles.page} className="animate-in">
      <ResponsiveStyles />
      
      {/* KPI Row - Added responsive class */}
      <div style={styles.kpiGrid} className="kpi-grid-res">
        {kpis.map(k => (
          <div key={k.label} className="card" style={{ borderTop: `2px solid ${k.color}` }}>
            <div style={styles.kpiLabel}>{k.label}</div>
            <div style={{ ...styles.kpiValue, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.up ? 'var(--accent)' : 'var(--red)', marginTop: 4 }}>
              {k.trend} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 - Added responsive class */}
      <div style={styles.row2} className="flex-row-res">
        <div className="card" style={{ flex: 2 }}>
          <SectionTitle sub="Monthly patient admissions across all departments">Patient Admissions Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={admissions}>
              <defs>
                <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="month" stroke="#3d6080" tick={{ fontSize: 12 }} />
              <YAxis stroke="#3d6080" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#00d4aa" strokeWidth={2.5} fill="url(#admGrad)" name="Admissions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <SectionTitle sub="Current patient distribution">Treatment Outcomes</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={outcomes} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                {outcomes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 - Added responsive class */}
      <div style={styles.row2} className="flex-row-res">
        <div className="card" style={{ flex: 1 }}>
          <SectionTitle sub="Revenue vs Expenses (in Lakhs INR)">Financial Performance</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="month" stroke="#3d6080" tick={{ fontSize: 12 }} />
              <YAxis stroke="#3d6080" tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#00d4aa" radius={[4,4,0,0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#f0565633" radius={[4,4,0,0]} name="Expenses" stroke="#f05656" strokeWidth={1} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <SectionTitle sub="Beds occupied vs capacity">Department Utilization</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            {departments.map(d => {
              const pct = Math.round((d.patients / d.beds) * 100);
              const color = pct > 85 ? 'var(--red)' : pct > 70 ? 'var(--yellow)' : 'var(--accent)';
              return (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color }}>{pct}% · {d.patients}/{d.beds}</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Line chart */}
      <div className="card">
        <SectionTitle sub="7-month trend of key financial indicators">Revenue vs Expenses Over Time</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
            <XAxis dataKey="month" stroke="#3d6080" tick={{ fontSize: 12 }} />
            <YAxis stroke="#3d6080" tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}L`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="revenue" stroke="#00d4aa" strokeWidth={2.5} dot={{ fill: '#00d4aa', r: 4 }} name="Revenue" />
            <Line type="monotone" dataKey="expenses" stroke="#f05656" strokeWidth={2.5} dot={{ fill: '#f05656', r: 4 }} name="Expenses" strokeDasharray="5 3" />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  kpiLabel: { fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 10 },
  kpiValue: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.5px' },
  row2: { display: 'flex', gap: 20 },
  barTrack: { height: 6, background: 'var(--bg-elevated)', borderRadius: 100, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 100, transition: 'width 0.6s ease' },
};

export default AnalyticsPage;