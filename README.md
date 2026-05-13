# FutureSelf ⚡

> **A message from your past self.** FutureSelf is an AI-powered reminder and personal accountability platform that bridges the gap between who you are today and who you want to become.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [How We Solve It](#-how-we-solve-it)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Data Models](#-data-models)
- [API Reference](#-api-reference)
- [Multi-Nudge Scheduling System](#-multi-nudge-scheduling-system)
- [Notification Channels](#-notification-channels)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Background Worker](#-background-worker)
- [Contributing](#-contributing)

---

## 🚨 Problem Statement

Traditional reminder apps fail people in three fundamental ways:

| Problem | Description |
|---|---|
| **The Mental Load** | Trying to hold everything in your head leads to anxiety and cognitive fatigue. Your brain uses valuable processing power just to keep track of tasks. |
| **Broken Context** | Generic reminders pop up at the wrong time with no context. Seeing "Buy Milk" during a deep-work session is useless noise — not a helpful nudge. |
| **Digital Noise** | Important goals get buried under a flood of social media pings, news alerts, and spam. There's no signal, only noise. |

Most reminder tools are **static ping machines** — they fire a notification and forget about you. They don't grow with you, they don't adapt to your progress, and they treat every reminder the same regardless of its personal importance or time horizon.

---

## ✅ How We Solve It

FutureSelf takes a fundamentally different approach:

1. **Write** — You write a note to your future self. Anything from a career goal to a small personal habit.
2. **Choose** — You set an importance level (`High`, `Medium`, `Low`) and a target reminder date. The system intelligently schedules multiple nudges between now and your deadline — not just a single notification at the end.
3. **Nudge** — An AI (powered by Google Gemini) generates a **personalized, warm, context-aware nudge message** referencing exactly how many days/weeks have passed and where you are in the journey. You receive this via **email and/or WhatsApp**.

The result: reminders that feel like hearing from a wise version of yourself, not a robotic to-do app.

---

## ✨ Features

### 🔐 Authentication
- **Secure Sign Up & Login** with email/password credentials via NextAuth.js
- Passwords hashed with **bcryptjs** — never stored in plain text
- **JWT-based sessions** that persist for 30 days with auto-refresh every 24 hours
- Protected routes redirect unauthenticated users to the login page

### 📝 Reminder Creation
- Rich reminder form with note input, importance selection (`High` / `Medium` / `Low`), and a target date/time picker
- **Optional WhatsApp number** field for dual-channel notifications
- **Multi-nudge scheduling** automatically computed at creation time based on the time window

### 📊 Dashboard
- Personalized greeting based on time of day (morning / afternoon / evening)
- **Upcoming Pipeline** — shows pending reminders with days-remaining countdown, color-coded by importance
- **Recent Time Capsules** — shows delivered reminders with archive action
- Quick stats: total pending vs. delivered

### 📈 Analytics & Insights
- **Growth Overview** with 4 KPI cards:
  - Total Reminders Sent (all time)
  - Completion Rate (%)
  - Habits Sustained (this month)
  - Active Streak / Follow-ups
- **Consistency Trends** — recharts-powered monthly bar and line graphs
- **Importance Breakdown** — pie/donut chart showing High / Medium / Low distribution
- **AI-powered Insights** panel with automated observations about your reminder patterns

### ⏰ Timeline View
- Chronological view of all your reminders across their full lifecycle
- Visual status indicators: `pending`, `processing`, `delivered`, `archived`, `failed`

### 🔔 Multi-Channel Notifications
- **📧 Email via Resend** — beautifully designed HTML email with your original note, AI nudge message, and one-click action buttons (`Mark as Done` / `Snooze 1 Week`)
- **💬 WhatsApp via Twilio** — instant WhatsApp message to your registered number with the nudge message

### 🤖 AI Nudge Generation (Gemini 2.0 Flash)
- Generates personalized 3-sentence motivational nudge messages for every reminder send
- Context-aware: knows how many days have passed since the note was written
- Sequence-aware: knows if it's nudge 1 of 3 or nudge 5 of 5 in the delivery series
- Graceful fallback to a static message if the Gemini API is unavailable

### ✅ Reminder Actions (via Email)
- **Mark as Done** — one-click URL from the email marks the reminder as delivered
- **Snooze 1 Week** — pushes the reminder date forward by 7 days without logging in

### ⚙️ User Settings
- Toggle email notification preferences
- Manage account details

### 🌐 Landing Page
- Hero section, problem statement, how-it-works steps, testimonials, tools used, and a call-to-action
- Seasonal canvas animations (Spring, Summer, Autumn, Winter snowfall)
- Fully responsive design with dark mode

---

## 🛠 Tech Stack

### Frontend
| Library | Purpose |
|---|---|
| **Next.js 14** (App Router) | Full-stack React framework |
| **TypeScript** | Static typing across the frontend |
| **Tailwind CSS** | Utility-first styling |
| **GSAP + Motion (Framer)** | Page and component animations |
| **Recharts** | Analytics charts (bar, line, pie) |
| **Lucide React + Tabler Icons** | Icon libraries |
| **react-hot-toast** | Toast notifications |
| **date-fns** | Date manipulation and formatting |

### Backend / API
| Library | Purpose |
|---|---|
| **Next.js API Routes** | Serverless API endpoints |
| **NextAuth.js v4** | Authentication (Credentials + JWT) |
| **Mongoose** | MongoDB ODM |
| **bcryptjs** | Password hashing |

### External Services
| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud database |
| **Google Gemini 2.0 Flash** | AI nudge message generation |
| **Resend** | Transactional email delivery |
| **Twilio** | WhatsApp messaging (Sandbox) |

### Background Worker
| Library | Purpose |
|---|---|
| **Node.js (ESM)** | Worker runtime |
| **node-cron** | Cron-based polling scheduler |
| **Mongoose** | MongoDB access |
| **@google/generative-ai** | Gemini API client |
| **Resend SDK** | Email sending |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      USER BROWSER                        │
│  Next.js Frontend (React, App Router, Tailwind CSS)      │
│  Pages: /, /login, /register, /dashboard, /create,      │
│         /analytics, /timeline, /settings                 │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│             VERCEL (Next.js Serverless)                  │
│                                                          │
│  API Routes:                                             │
│  ├── /api/auth/[...nextauth]  → NextAuth (JWT sessions)  │
│  ├── /api/user/register       → User creation            │
│  ├── /api/reminders/*         → CRUD + list + update     │
│  ├── /api/reminder/done       → Mark as done (email link)│
│  ├── /api/reminder/snooze     → Snooze 1 week (email link│
│  ├── /api/analytics/stats     → Analytics data           │
│  └── /api/notifications/*     → Twilio WhatsApp trigger  │
└──────┬───────────────────────────────────────────────────┘
       │ Mongoose (MongoDB Wire Protocol)
       ▼
┌─────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Cloud DB)                    │
│  Collections:                                            │
│  ├── users       → Accounts, hashed passwords            │
│  └── reminders   → Notes, schedules, statuses, nudges    │
└──────────────────────────────────────────────────────────┘
       ▲
       │ Poll every minute (cron)
┌─────────────────────────────────────────────────────────┐
│         RENDER / RAILWAY (Background Worker)             │
│                                                          │
│  worker/src/index.js — Entry point                       │
│  worker/src/processor.js — Core poll loop                │
│                                                          │
│  Every minute:                                           │
│  1. Release stale locks (>10 min in 'processing')        │
│  2. Query for due reminders (schedule slot ≤ now)        │
│  3. Atomically claim each reminder (optimistic lock)     │
│  4. Call Gemini API → generate personalized nudge        │
│  5. Send email via Resend                                │
│  6. Mark slot as 'sent'; advance or finalize status      │
│  7. Retry up to 3× on failure; then mark 'failed'        │
└──────┬───────────────┬───────────────────────────────────┘
       │               │
       ▼               ▼
  ┌──────────┐   ┌──────────────┐
  │  RESEND  │   │   GEMINI     │
  │  Email   │   │  AI Nudge    │
  └──────────┘   └──────────────┘
       
  Optionally also:
  ┌──────────────────┐
  │  TWILIO          │
  │  WhatsApp / SMS  │
  └──────────────────┘
```

### Request Flow — Creating a Reminder
```
User fills form → POST /api/reminders/create
  → Validates session (NextAuth JWT)
  → buildReminderSchedule(createdAt, reminderDate) → ScheduleSlot[]
  → Saves Reminder doc to MongoDB with status: 'pending'
  → (Optional) Triggers WhatsApp notification via Twilio
  → Returns 201
```

### Request Flow — Delivering a Reminder (Worker)
```
node-cron tick (every minute)
  → Reminder.find({ status: 'pending', schedule slot ≤ now })
  → findOneAndUpdate (atomic claim → status: 'processing')
  → Gemini API → generateNudgeMessage(note, importance, daysAgo, ctx)
  → Resend → sendReminderEmail(to, name, note, nudgeMessage, id)
  → Update slot: status 'sent', sentAt: now
  → If more slots pending → status: 'pending' (continue series)
  → If last slot → status: 'delivered', deliveredAt: now
```

---

## 📁 Project Structure

```
futureself-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (fonts, providers)
│   ├── globals.css               # Global styles & design tokens
│   ├── login/page.tsx            # Login form
│   ├── register/page.tsx         # Registration form
│   ├── onboarding/page.tsx       # Post-registration onboarding
│   ├── dashboard/page.tsx        # Main dashboard
│   ├── create/page.tsx           # Create reminder form
│   ├── analytics/page.tsx        # Analytics & charts
│   ├── timeline/page.tsx         # Chronological timeline view
│   ├── settings/page.tsx         # User settings
│   ├── pages/                    # Landing page section components
│   │   ├── heropage.tsx
│   │   ├── Problem.tsx
│   │   ├── TestimonialPage.tsx
│   │   ├── Timeline.tsx
│   │   ├── Tools.tsx
│   │   └── CTA.tsx
│   └── api/                      # Serverless API routes
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── user/register/        # User registration
│       ├── reminders/
│       │   ├── create/           # POST new reminder
│       │   ├── list/             # GET reminders (filterable)
│       │   └── update/           # PUT reminder status
│       ├── reminder/
│       │   ├── done/             # One-click mark as done
│       │   └── snooze/           # One-click snooze 1 week
│       ├── analytics/stats/      # GET analytics data
│       ├── notifications/        # WhatsApp trigger endpoint
│       └── test-cron/            # Dev testing endpoint
│
├── components/                   # Shared React components
│   ├── Navbar.tsx                # Top navigation bar
│   ├── Sidebar.tsx               # Authenticated app sidebar
│   ├── ReminderCard.tsx          # Reminder display card
│   ├── Charts.tsx                # Recharts wrappers
│   ├── StatsCard.tsx             # KPI stat card
│   ├── DateTimePicker.jsx        # Custom date-time picker
│   ├── AuthProvider.tsx          # NextAuth SessionProvider wrapper
│   └── ui/                       # Primitive UI components
│
├── lib/                          # Shared utilities & integrations
│   ├── auth.ts                   # NextAuth authOptions config
│   ├── mongodb.ts                # Mongoose connection singleton
│   ├── gemini.ts                 # Gemini AI nudge generation
│   ├── resend.ts                 # Resend email sender + HTML template
│   ├── reminderSchedule.ts       # Multi-nudge schedule builder
│   ├── whatsapp.js               # Twilio WhatsApp sender
│   ├── sms.js                    # Twilio SMS sender
│   ├── datetime.ts               # Date utility helpers
│   └── utils.ts                  # General utilities
│
├── models/                       # Mongoose schemas
│   ├── User.ts                   # User model
│   └── Reminder.ts               # Reminder model (with schedule slots)
│
├── hooks/                        # Custom React hooks
│
├── worker/                       # Standalone background worker
│   ├── package.json              # Worker dependencies
│   ├── Procfile                  # Render/Railway process definition
│   ├── railway.json              # Railway deployment config
│   └── src/
│       ├── index.js              # Entry point (cron scheduler)
│       ├── processor.js          # Core polling + delivery logic
│       ├── db.js                 # MongoDB connection
│       ├── gemini.js             # Gemini nudge (worker copy)
│       ├── email.js              # Resend email (worker copy)
│       ├── reminderSchedule.js   # Schedule helpers (worker copy)
│       └── models/               # Mongoose models (worker copy)
│
├── .env.local.example            # Environment variable template
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── vercel.json                   # Vercel deployment config
```

---

## 🗄 Data Models

### User
```typescript
{
  name: string;                // Full name
  email: string;               // Unique, lowercase
  hashedPassword: string;      // bcryptjs hash
  emailNotifications: boolean; // Toggle email delivery (default: true)
  createdAt: Date;
}
```

### Reminder
```typescript
{
  userId: ObjectId;            // Reference to User
  note: string;                // The message to future self
  reminderDate: Date;          // Target delivery deadline
  importance: 'High' | 'Medium' | 'Low';
  email: string;               // Delivery email address
  whatsappNumber?: string;     // E.164 format, e.g. "+919876543210"
  
  status: 'pending' | 'processing' | 'delivered' | 'archived' | 'failed';
  
  // Multi-nudge schedule (auto-built at creation)
  schedule?: [{
    sendAt: Date;              // Scheduled send time
    status: 'pending' | 'sent';
    sentAt?: Date;
  }];
  
  nudgeMessage?: string;       // Last AI-generated nudge
  createdAt: Date;
  deliveredAt?: Date;
  
  // Worker concurrency fields
  processingAt?: Date;         // Timestamp when claimed by worker
  retryCount: number;          // Delivery attempts (max 3)
  lastError?: string;          // Last failure reason
}
```

---

## 🌐 API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/[...nextauth]` | NextAuth login / session management |
| `POST` | `/api/user/register` | Create new user account |

### Reminders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reminders/create` | Create a new reminder with schedule |
| `GET` | `/api/reminders/list` | List reminders (`?status=pending&limit=5`) |
| `PUT` | `/api/reminders/update` | Update reminder status (e.g., archive) |
| `GET` | `/api/reminder/done` | One-click mark as done from email link |
| `GET` | `/api/reminder/snooze` | One-click snooze 1 week from email link |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/stats` | Aggregated stats, charts data, insights |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notifications/whatsapp` | Trigger WhatsApp message via Twilio |

---

## 🗓 Multi-Nudge Scheduling System

One of FutureSelf's core innovations is its **intelligent reminder series** system. Instead of one notification at the deadline, the system builds an evenly-spaced series of nudges from creation to deadline:

| Time Window | Number of Nudges | Distribution |
|---|---|---|
| < 1 hour | 1 | At deadline |
| 1 hour – 1 day | 2 | 50% through, at deadline |
| 1 day – 1 week | 3 | ⅓, ⅔, at deadline |
| > 1 week | 5 | 20%, 40%, 60%, 80%, at deadline |

Each nudge is delivered by the background worker and tagged with its sequence position (e.g., "Reminder 2 of 5"), so Gemini can write context-appropriate messages for early-stage motivation vs. final-hour urgency.

---

## 📬 Notification Channels

### Email (Resend)
Emails are sent with a fully branded dark-mode HTML template that includes:
- Your original note displayed as a pull quote
- The AI-generated nudge message
- **"✅ Mark as Done"** — one-click action button
- **"⏰ Snooze 1 Week"** — one-click snooze button
- Sequence label (e.g., "Reminder 3 of 5")
- Link back to your dashboard

### WhatsApp (Twilio Sandbox)
- Uses the Twilio WhatsApp Sandbox (`whatsapp:+14155238886`)
- Accepts any E.164-formatted number (`+919876543210`)
- Automatically prefixes the `whatsapp:` scheme
- Triggered at reminder creation time or by the worker

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9
- A **MongoDB Atlas** cluster (free tier works)
- Accounts for: **Resend**, **Google AI Studio** (Gemini), **Twilio** (optional)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/futureself-app.git
cd futureself-app
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
# Fill in all required values (see Environment Variables section)
```

### 3. Run the Development Server

```bash
npm run dev
# App available at http://localhost:3000
```

### 4. Run the Background Worker (Locally)

```bash
cd worker
npm install
cp .env.example .env
# Fill in worker env vars
npm run dev
# Worker polls MongoDB every minute
```

---

## 🔑 Environment Variables

### Next.js App (`.env.local`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `RESEND_API_KEY` | ✅ | Resend API key for email |
| `NEXTAUTH_SECRET` | ✅ | Random string for JWT signing |
| `NEXTAUTH_URL` | ✅ | Full URL of your app (e.g., `http://localhost:3000`) |
| `APP_BASE_URL` | ✅ | Public URL for email action links |
| `TWILIO_ACCOUNT_SID` | ⚪ | Twilio Account SID (WhatsApp/SMS) |
| `TWILIO_AUTH_TOKEN` | ⚪ | Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | ⚪ | Sender number (default: Twilio sandbox) |

### Worker (`worker/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | Same MongoDB connection string |
| `GEMINI_API_KEY` | ✅ | Same Gemini API key |
| `RESEND_API_KEY` | ✅ | Same Resend API key |
| `APP_BASE_URL` | ✅ | Public URL for email action links |
| `POLL_CRON` | ⚪ | Cron expression (default: `* * * * *`) |

---

## 🌍 Deployment

### Frontend — Vercel

1. Connect your GitHub repository to Vercel
2. Add all environment variables from the table above in the Vercel dashboard
3. Deploy — Vercel handles Next.js builds automatically

```bash
# Or deploy via CLI
npx vercel --prod
```

### Background Worker — Render (or Railway)

The `worker/` directory is a self-contained Node.js service.

**Render:**
1. Create a new **Background Worker** service in Render
2. Set Root Directory to `worker`
3. Build Command: `npm install`
4. Start Command: `npm start` (or use `Procfile`: `worker: node src/index.js`)
5. Add all worker environment variables

**Railway:**
```bash
# Uses worker/railway.json for configuration
railway deploy
```

---

## ⚙️ Background Worker Deep Dive

The worker (`worker/src/processor.js`) implements a **battle-hardened polling loop** with:

### Optimistic Locking
```
findOneAndUpdate({ status: 'pending' }, { status: 'processing', processingAt: now })
```
Atomically claims a reminder, preventing duplicate sends across multiple worker instances.

### Stale Lock Recovery
If a reminder stays in `processing` for > 10 minutes (e.g., due to a crash), it is automatically released back to `pending` on the next poll.

### Retry Logic
- Maximum **3 delivery attempts** per reminder
- On failure: increments `retryCount`, stores `lastError`, resets to `pending`
- After 3 failures: sets status to `failed` permanently (no further attempts)

### Graceful Shutdown
Handles `SIGTERM` and `SIGINT` for clean shutdown in containerized environments.

---

## 🧩 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with proper TypeScript types
4. Test locally with both `npm run dev` (app) and `npm run dev` (worker)
5. Open a pull request with a clear description

### Code Conventions
- TypeScript for all Next.js app code
- ESM (`import`/`export`) throughout
- Mongoose models defined with TypeScript interfaces
- Environment variables accessed via `process.env.*` (never hardcoded)

---

## 📄 License

MIT © 2025 Mindful Tech Group

---

> *"The future depends on what you do today."* — Mahatma Gandhi
