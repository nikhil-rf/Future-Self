function generateEmailHTML(userName, note, nudgeMessage, reminderId, appBaseUrl) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background-color: #181717; color: #f0eded; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #1e1d1d; border: 1px solid #2c2a2a; border-radius: 16px; padding: 32px; overflow: hidden; }
    .header { font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #f0eded; letter-spacing: -0.03em; }
    .note-block { background-color: #111010; border-left: 4px solid #4b2bee; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 24px; font-style: italic; color: #c8c4c4; line-height: 1.6; }
    .nudge-block { background-color: rgba(75, 43, 238, 0.1); border: 1px solid rgba(75, 43, 238, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 32px; color: #c4b5fd; line-height: 1.6; font-size: 15px; }
    .btn-container { display: flex; gap: 16px; margin-top: 24px; }
    .btn { display: inline-block; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; }
    .btn-primary { background-color: #4b2bee; color: #ffffff; }
    .btn-secondary { background-color: transparent; border: 1px solid #4b2bee; color: #c4b5fd; }
    .footer { margin-top: 40px; font-size: 12px; color: #7a7676; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Hey \${userName}, your future self is calling 👋</div>
    
    <p style="color: #9c9898; font-size: 14px; margin-bottom: 12px;">You asked us to remind you about this:</p>
    
    <div class="note-block">
      "\${note}"
    </div>
    
    <p style="color: #9c9898; font-size: 14px; margin-bottom: 12px;">A little perspective from AI:</p>
    
    <div class="nudge-block">
      \${nudgeMessage}
    </div>
    
    <p style="color: #7a7676; font-size: 14px; margin-bottom: 16px;">What would you like to do with this reminder?</p>
    
    <div class="btn-container">
      <a href="\${appBaseUrl}/api/reminder/done?id=\${reminderId}" class="btn btn-primary">✅ Mark as Done</a>
      <a href="\${appBaseUrl}/api/reminder/snooze?id=\${reminderId}" class="btn btn-secondary">⏰ Snooze 1 Week</a>
    </div>
  </div>
  <div class="footer">
    FutureSelf © \${new Date().getFullYear()} · Mindful Tech Group
  </div>
</body>
</html>
  `;
}

module.exports = { generateEmailHTML };
