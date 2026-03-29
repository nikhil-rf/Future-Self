/**
 * `<input type="datetime-local">` yields `YYYY-MM-DDTHH:mm` with no timezone.
 * On the server (e.g. Railway UTC), `new Date(thatString)` is interpreted as UTC,
 * not the user's local time — so reminders fire at the wrong instant.
 * Parse in the browser (local) and send UTC ISO to the API.
 */
export function localDatetimeInputToUtcIso(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return d.toISOString();
}
