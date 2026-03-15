'use client';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface MonthlyData { month: string; count: number; }
interface CompletionData { month: string; rate: number; }
interface ImportanceData { name: string; value: number; }

interface ChartsProps {
  monthlyData: MonthlyData[];
  completionTrend: CompletionData[];
  importanceBreakdown: ImportanceData[];
}

const PIE_COLORS = ['#ef4444', '#facc15', '#4ade80'];

const tooltipStyle = {
  contentStyle: { background: '#111118', border: '1px solid #1e1e2e', borderRadius: '10px', color: '#e2e8f0', fontSize: '13px' },
  labelStyle: { color: '#9ca3af' },
};

export default function Charts({ monthlyData, completionTrend, importanceBreakdown }: ChartsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Bar chart */}
      <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>📊 Reminders Created (6 mo)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Reminders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line chart */}
      <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>📈 Completion Rate Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={completionTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Completion']} />
            <Line type="monotone" dataKey="rate" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill: '#a78bfa', r: 4 }} name="Completion %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donut chart */}
      <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, color: '#e2e8f0', alignSelf: 'flex-start' }}>🍩 By Importance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={importanceBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
              {importanceBreakdown.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
            <Legend formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
