import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

interface SendReminderEmailParams {
  to: string;
  name: string;
  note: string;
  nudgeMessage: string;
  reminderId: string;
  sequenceLabel?: string;
}

export async function sendReminderEmail({
  to,
  name,
  note,
  nudgeMessage,
  reminderId,
  sequenceLabel,
}: SendReminderEmailParams) {
  const doneUrl = `${BASE_URL}/api/reminder/done?id=${reminderId}`;
  const snoozeUrl = `${BASE_URL}/api/reminder/snooze?id=${reminderId}`;
  const firstName = name.split(' ')[0];
  const seqLine = sequenceLabel
    ? `<p style="color:#818cf8;font-size:12px;margin:0 0 16px;font-weight:600;">${sequenceLabel}</p>`
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FutureSelf Reminder</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#6366f1;font-size:28px;font-weight:700;margin:0;letter-spacing:-0.5px;">FutureSelf</h1>
      <p style="color:#6b7280;margin:6px 0 0;font-size:14px;">A message from your past self</p>
    </div>
    
    <div style="background:#111118;border:1px solid #1e1e2e;border-radius:16px;padding:32px;margin-bottom:24px;">
      <p style="color:#e2e8f0;font-size:18px;font-weight:600;margin:0 0 8px;">Hey ${firstName}, your future self is calling 👋</p>
      ${seqLine}
      <p style="color:#9ca3af;font-size:14px;margin:0 0 24px;">Here's what you wanted to remember:</p>
      
      <div style="background:#1a1a2e;border-left:4px solid #6366f1;border-radius:8px;padding:20px;margin-bottom:24px;">
        <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0;font-style:italic;">"${note}"</p>
      </div>
      
      <div style="background:#0f0f1a;border:1px solid #1e1e2e;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="color:#a78bfa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">AI Nudge from FutureSelf</p>
        <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0;">${nudgeMessage}</p>
      </div>
      
      <div style="text-align:center;display:flex;gap:12px;justify-content:center;">
        <a href="${doneUrl}" style="display:inline-block;background:#10b981;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:0 6px;">✅ Mark as Done</a>
        <a href="${snoozeUrl}" style="display:inline-block;background:#374151;color:#e2e8f0;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:0 6px;">⏰ Snooze 1 Week</a>
      </div>
    </div>

    <p style="color:#4b5563;font-size:12px;text-align:center;margin:0;">
      You're receiving this because you set a reminder on FutureSelf.<br/>
      <a href="${BASE_URL}/dashboard" style="color:#6366f1;text-decoration:none;">View your Dashboard</a>
    </p>
  </div>
</body>
</html>`;

  const subjectSuffix = sequenceLabel ? ` (${sequenceLabel})` : '';
  const { data, error } = await resend.emails.send({
    from: 'FutureSelf <onboarding@resend.dev>',
    to,
    subject: `Hey ${firstName}, your future self is calling 👋${subjectSuffix}`,
    html,
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }

  return data;
}
