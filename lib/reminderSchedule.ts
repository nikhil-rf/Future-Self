/**
 * Builds send times between creation and the final reminder deadline.
 * Longer windows get more nudges (up to 5 evenly spaced sends, last = deadline).
 */

export type ScheduleSlot = {
  sendAt: Date;
  status: 'pending' | 'sent';
  sentAt?: Date;
};

export function buildReminderSchedule(createdAt: Date, reminderDate: Date): ScheduleSlot[] {
  const start = createdAt.getTime();
  const end = reminderDate.getTime();
  const span = end - start;

  if (span <= 0) {
    return [{ sendAt: new Date(end), status: 'pending' }];
  }

  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  let fractions: number[];
  if (span < HOUR) {
    fractions = [1];
  } else if (span < DAY) {
    fractions = [0.5, 1];
  } else if (span < 7 * DAY) {
    fractions = [1 / 3, 2 / 3, 1];
  } else {
    fractions = [0.2, 0.4, 0.6, 0.8, 1];
  }

  const timesMs = fractions.map((f) => Math.round(start + span * f));
  const uniqueSorted = Array.from(new Set(timesMs)).sort((a, b) => a - b);
  if (uniqueSorted.length === 0) {
    return [{ sendAt: new Date(end), status: 'pending' }];
  }
  uniqueSorted[uniqueSorted.length - 1] = end;

  return uniqueSorted.map((ms) => ({
    sendAt: new Date(ms),
    status: 'pending' as const,
  }));
}

export function getEffectiveSchedule(reminder: {
  schedule?: ScheduleSlot[] | null;
  reminderDate: Date;
}): ScheduleSlot[] {
  if (Array.isArray(reminder.schedule) && reminder.schedule.length > 0) {
    return reminder.schedule;
  }
  return [{ sendAt: reminder.reminderDate, status: 'pending' }];
}

export function findNextDueSlotIndex(schedule: ScheduleSlot[], now: Date): number {
  const t = now.getTime();
  for (let i = 0; i < schedule.length; i++) {
    const s = schedule[i];
    if (s.status !== 'pending') continue;
    if (new Date(s.sendAt).getTime() <= t) return i;
  }
  return -1;
}

export function hasPendingAfter(schedule: ScheduleSlot[], index: number): boolean {
  return schedule.some((s, i) => i !== index && s.status === 'pending');
}

export type NudgeContext = {
  sequenceIndex: number;
  sequenceTotal: number;
  untilDeadline: string;
};

export function buildNudgeContext(
  reminder: { reminderDate: Date },
  now: Date,
  slotIndex: number,
  scheduleLength: number
): NudgeContext {
  const deadline = new Date(reminder.reminderDate);
  const ms = deadline.getTime() - now.getTime();
  const hoursLeft = Math.floor(ms / (60 * 60 * 1000));
  const daysLeft = Math.floor(ms / (24 * 60 * 60 * 1000));
  let untilDeadline: string;
  if (hoursLeft <= 48 && hoursLeft >= 0) {
    untilDeadline = `about ${hoursLeft} hour(s) until your deadline`;
  } else if (daysLeft >= 0) {
    untilDeadline = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} until your deadline`;
  } else {
    untilDeadline = 'your deadline has passed — still worth doing';
  }
  return {
    sequenceIndex: slotIndex + 1,
    sequenceTotal: scheduleLength,
    untilDeadline,
  };
}
