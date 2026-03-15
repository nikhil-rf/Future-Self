'use client';
import Link from 'next/link';
import { format, differenceInDays, isPast } from 'date-fns';

type Importance = 'High' | 'Medium' | 'Low';

interface ReminderCardProps {
  id: string;
  note: string;
  reminderDate: string | Date;
  importance: Importance;
  status: string;
  nudgeMessage?: string;
  onMarkDone?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const importanceBadge: Record<Importance, string> = {
  High: 'badge-high',
  Medium: 'badge-medium',
  Low: 'badge-low',
};

const importanceDot: Record<Importance, string> = {
  High: '#ef4444',
  Medium: '#facc15',
  Low: '#4ade80',
};

export default function ReminderCard({
  id,
  note,
  reminderDate,
  importance,
  status,
  nudgeMessage,
  onMarkDone,
  onArchive,
  onDelete,
  onEdit,
}: ReminderCardProps) {
  const date = new Date(reminderDate);
  const daysLeft = differenceInDays(date, new Date());
  const isOverdue = isPast(date) && status === 'pending';

  return (
    <div
      style={{
        background: '#111118',
        border: '1px solid #1e1e2e',
        borderRadius: '14px',
        padding: '20px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        opacity: status === 'archived' ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (status !== 'archived') {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className={importanceBadge[importance]}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: importanceDot[importance], marginRight: '5px', verticalAlign: 'middle' }} />
            {importance}
          </span>
          {status === 'delivered' && (
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
              ✅ Delivered
            </span>
          )}
          {status === 'archived' && (
            <span style={{ background: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', border: '1px solid rgba(107, 114, 128, 0.3)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
              Archived
            </span>
          )}
          {isOverdue && (
            <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
              Overdue
            </span>
          )}
        </div>

        {/* Days chip */}
        {status === 'pending' && (
          <span style={{
            background: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
            color: isOverdue ? '#f87171' : '#a5b4fc',
            border: `1px solid ${isOverdue ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            {isOverdue ? 'overdue' : daysLeft === 0 ? 'today' : `in ${daysLeft}d`}
          </span>
        )}

        {status === 'delivered' && (
          <span style={{ color: '#6b7280', fontSize: '12px' }}>
            {format(date, 'MMM d, yyyy')}
          </span>
        )}
      </div>

      {/* Note */}
      <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6', margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {note}
      </p>

      {/* Nudge message (delivered) */}
      {nudgeMessage && status === 'delivered' && (
        <div style={{ background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '12px', marginTop: '12px', marginBottom: '12px' }}>
          <p style={{ color: '#a78bfa', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' }}>AI Nudge</p>
          <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{nudgeMessage}</p>
        </div>
      )}

      {/* Date */}
      <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>📅</span>
        {format(date, 'MMM d, yyyy · h:mm a')}
      </p>

      {/* Actions */}
      {(onMarkDone || onArchive || onDelete || onEdit) && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {onEdit && status === 'pending' && (
            <button
              onClick={() => onEdit(id)}
              style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #1e1e2e', background: 'transparent', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              ✏️ Edit
            </button>
          )}
          {onMarkDone && status === 'delivered' && (
            <button
              onClick={() => onMarkDone(id)}
              style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              ✅ Done
            </button>
          )}
          {onArchive && (status === 'delivered' || status === 'pending') && (
            <button
              onClick={() => onArchive(id)}
              style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #1e1e2e', background: 'transparent', color: '#6b7280', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🗄️ Archive
            </button>
          )}
          {onDelete && status === 'archived' && (
            <button
              onClick={() => onDelete(id)}
              style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
