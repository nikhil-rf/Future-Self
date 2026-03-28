// worker/src/index.js
// Entry point — loads env, connects to DB, starts cron job.

import 'dotenv/config';
import cron from 'node-cron';
import { connectDB } from './db.js';
import { processDueReminders } from './processor.js';

const POLL_CRON = process.env.POLL_CRON || '* * * * *'; // default: every minute

async function main() {
  console.log('[Worker] FutureSelf worker starting...');
  console.log(`[Worker] Poll schedule: "${POLL_CRON}"`);

  // Connect once on startup; the db module handles reconnects automatically
  await connectDB();

  // ── Health-check: run once immediately so we know it works ───────────────
  console.log('[Worker] Running initial poll...');
  await processDueReminders().catch((err) =>
    console.error('[Worker] Initial poll error:', err)
  );

  // ── Schedule recurring polls ──────────────────────────────────────────────
  cron.schedule(POLL_CRON, async () => {
    try {
      await processDueReminders();
    } catch (err) {
      // Don't let an unhandled error kill the process — just log and continue
      console.error('[Worker] Poll cycle error:', err);
    }
  });

  console.log('[Worker] Scheduler running. Press Ctrl+C to stop.');
}

// ── Graceful shutdown ─────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('[Worker] SIGTERM received — shutting down gracefully');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('[Worker] SIGINT received — shutting down gracefully');
  process.exit(0);
});

main().catch((err) => {
  console.error('[Worker] Fatal startup error:', err);
  process.exit(1);
});
