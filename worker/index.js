require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const { Resend } = require('resend');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const Reminder = require('./reminderModel');
const { generateEmailHTML } = require('./emailTemplate');

// Log environment status safely
console.log('--- FutureSelf Worker Starting ---');
console.log(`Node Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`MONGODB_URI loaded: ${!!process.env.MONGODB_URI}`);
console.log(`GEMINI_API_KEY loaded: ${!!process.env.GEMINI_API_KEY}`);
console.log(`RESEND_API_KEY loaded: ${!!process.env.RESEND_API_KEY}`);
console.log(`APP_BASE_URL: ${process.env.APP_BASE_URL}`);

// Validate required environment variables
const requiredEnvs = ['MONGODB_URI', 'GEMINI_API_KEY', 'RESEND_API_KEY', 'APP_BASE_URL'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
  console.error(`🚨 Missing required environment variables: \${missingEnvs.join(', ')}`);
  process.exit(1);
}

// Initialize clients
const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function processReminders() {
  console.log(`\n[\${new Date().toISOString()}] 🔍 Searching for due reminders...`);
  try {
    const dueReminders = await Reminder.find({
      status: 'pending',
      reminderDate: { $lte: new Date() }
    });

    console.log(`[\${new Date().toISOString()}] 📦 Found \${dueReminders.length} due reminder(s)`);

    for (const reminder of dueReminders) {
      console.log(`\n⏳ Processing reminder ID: \${reminder._id} for \${reminder.email}`);
      try {
        // 1. Calculate days ago
        let daysAgo = 0;
        if (reminder.createdAt) {
          daysAgo = Math.floor((new Date() - new Date(reminder.createdAt)) / (1000 * 60 * 60 * 24));
        }
        
        // 2. Generate Nudge
        const prompt = `The user wrote this note to their future self \${daysAgo} days ago: '\${reminder.note}'. Importance: \${reminder.importance}. Write a short, warm, motivating nudge message in max 3 sentences. Be personal, not robotic.`;
        
        console.log(`   - Calling Gemini API...`);
        const result = await model.generateContent(prompt);
        const nudgeMessage = result.response.text();
        console.log(`   - Generated nudge: "\${nudgeMessage}"`);

        // 3. Generate Email HTML
        const emailHtml = generateEmailHTML(
          reminder.userName, 
          reminder.note, 
          nudgeMessage, 
          reminder._id, 
          process.env.APP_BASE_URL
        );

        // 4. Send Email via Resend
        console.log(`   - Sending email via Resend...`);
        const { data, error } = await resend.emails.send({
          from: 'FutureSelf <onboarding@resend.dev>', // Update this when you verify your domain on Resend
          to: reminder.email,
          subject: `Hey \${reminder.userName}, your future self is calling 👋`,
          html: emailHtml
        });

        if (error) {
          throw new Error(`Resend Error: \${JSON.stringify(error)}`);
        }
        console.log(`   - Email sent successfully! ID: \${data.id}`);

        // 5. Update DB
        reminder.status = 'delivered';
        reminder.deliveredAt = new Date();
        reminder.nudgeMessage = nudgeMessage;
        await reminder.save();
        console.log(`   - 💾 Reminder \${reminder._id} marked as delivered in DB`);

      } catch (err) {
        console.error(`   ❌ Failed to process reminder \${reminder._id}:`, err);
        // Continue to the next reminder even if this one failed
      }
    }
    
    console.log(`\n[\${new Date().toISOString()}] ✨ Finished processing batch`);
  } catch (err) {
    console.error('❌ Failed to fetch reminders from DB:', err);
  }
}

// Start sequence
async function startWorker() {
  console.log('🚀 Initializing Worker Service...');
  await connectDB();
  
  // Optionally run once immediately on startup to catch up
  console.log('🏃 Running initial catch-up execution...');
  await processReminders();

  // Schedule cron job (runs exactly at the top of every hour: minute 0)
  console.log('⏰ Scheduling cron job to run every hour (0 * * * *)');
  cron.schedule('0 * * * *', () => {
    processReminders();
  });
}

// Global error handlers to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
});

// Go!
startWorker();
