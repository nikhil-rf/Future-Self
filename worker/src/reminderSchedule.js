// Mirrors lib/reminderSchedule.ts for the worker (plain ESM).

export function getEffectiveSchedule(reminder) {
  if (Array.isArray(reminder.schedule) && reminder.schedule.length > 0) {
    return reminder.schedule;
  }
  return [{ sendAt: reminder.reminderDate, status: 'pending' }];
}

export function findNextDueSlotIndex(schedule, now) {
  const t = now.getTime();
  for (let i = 0; i < schedule.length; i++) {
    const s = schedule[i];
    if (s.status !== 'pending') continue;
    if (new Date(s.sendAt).getTime() <= t) return i;
  }
  return -1;
}

export function hasPendingAfter(schedule, index) {
  return schedule.some((s, i) => i !== index && s.status === 'pending');
}

export function buildNudgeContext(reminder, now, slotIndex, scheduleLength) {
  const deadline = new Date(reminder.reminderDate);
  const ms = deadline.getTime() - now.getTime();
  const hoursLeft = Math.floor(ms / (60 * 60 * 1000));
  const daysLeft = Math.floor(ms / (24 * 60 * 60 * 1000));
  let untilDeadline;
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
