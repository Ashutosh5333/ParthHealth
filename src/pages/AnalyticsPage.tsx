import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { ANALYTICS_DATA } from '../utils/mockData';

const KPIBox = ({ value, label, color }: { value: string; label: string; color: string }) => (
  <div style={{ flex: 1, minWidth: 120, background: 'var(--navy4)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{label}</div>
  </div>
);

const TOOLTIP_STYLE = {
  contentStyle: { background: 'var(--navy3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text1)' }
};

export default function AnalyticsPage() {
  const { monthly, departments, bedUtilization, statusBreakdown } = ANALYTICS_DATA;

  const monthlyData = monthly.labels.map((l, i) => ({
    month: l, admissions: monthly.admissions[i], discharges: monthly.discharges[i],
  }));

  const bedData = monthly.labels.map((l, i) => ({ month: l, utilization: bedUtilization[i] }));

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Analytics</div>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>Real-time hospital performance metrics</div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <KPIBox value="1,248" label="Total Visits (30d)" color="var(--teal)" />
        <KPIBox value="94.2%" label="Patient Satisfaction" color="var(--blue)" />
        <KPIBox value="3.4d" label="Avg Stay Duration" color="var(--amber)" />
        <KPIBox value="98.1%" label="Record Accuracy" color="var(--green)" />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

        {/* Admissions vs Discharges */}
        <div className="card">
          <div className="card-head"><span className="card-title">Monthly Admissions vs Discharges</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="admG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/><stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="disG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4dabf7" stopOpacity={0.2}/><stop offset="95%" stopColor="#4dabf7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4a6080', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text2)' }} />
              <Area type="monotone" dataKey="admissions" stroke="#00d4aa" strokeWidth={2} fill="url(#admG)" name="Admissions" />
              <Area type="monotone" dataKey="discharges" stroke="#4dabf7" strokeWidth={2} fill="url(#disG)" name="Discharges" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Pie */}
        <div className="card">
          <div className="card-head"><span className="card-title">Department Load Distribution</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={departments} cx="40%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {departments.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, '']} />
              <Legend
                layout="vertical" align="right" verticalAlign="middle"
                wrapperStyle={{ fontSize: 11, color: 'var(--text2)' }}
                formatter={(value) => <span style={{ color: 'var(--text2)' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="card">
          <div className="card-head"><span className="card-title">Patient Status Breakdown</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusBreakdown} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, 'Patients']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusBreakdown.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bed Utilization */}
        <div className="card">
          <div className="card-head"><span className="card-title">Bed Utilization Trend</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#4a6080', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#4a6080', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, 'Utilization']} />
              <Line type="monotone" dataKey="utilization" stroke="#ffa94d" strokeWidth={2} dot={{ fill: '#ffa94d', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary cards */}
        <div className="card">
          <div className="card-head"><span className="card-title">Key Insights</span></div>
          {[
            { label: 'Peak admission day', value: 'Sunday', color: 'var(--teal)' },
            { label: 'Avg ICU occupancy', value: '91%', color: 'var(--red)' },
            { label: 'Readmission rate (30d)', value: '4.2%', color: 'var(--amber)' },
            { label: 'Mortality rate', value: '1.1%', color: 'var(--blue)' },
            { label: 'Infection control score', value: '98.4%', color: 'var(--green)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>{item.label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Staff summary */}
        <div className="card">
          <div className="card-head"><span className="card-title">Staff Metrics</span></div>
          {[
            { label: 'Nurses on duty', value: '24' },
            { label: 'Doctors on duty', value: '7' },
            { label: 'Support staff', value: '18' },
            { label: 'Avg patient-to-nurse ratio', value: '1:4' },
            { label: 'Avg patient-to-doctor ratio', value: '1:12' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>{item.label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
