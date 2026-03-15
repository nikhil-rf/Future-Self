interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

export default function StatsCard({ icon, label, value, sub, color = '#6366f1' }: StatsCardProps) {
  return (
    <div
      style={{
        background: '#111118',
        border: '1px solid #1e1e2e',
        borderRadius: '14px',
        padding: '24px',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          {icon}
        </div>
        <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>{label}</span>
      </div>
      <p style={{ color: '#f1f5f9', fontSize: '32px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{value}</p>
      {sub && <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{sub}</p>}
    </div>
  );
}
