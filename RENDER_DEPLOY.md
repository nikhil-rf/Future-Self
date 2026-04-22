# Deploy setup: Vercel + Render

Frontend is deployed on Vercel.
This repo's root `render.yaml` is for deploying only:
- `futureself-worker` (background reminder worker) on Render

## 1) Push this repo to GitHub

Render Blueprint deploys from a Git repository.

## 2) Create worker from Blueprint

1. In Render, click **New +** -> **Blueprint**.
2. Select this repository.
3. Render will detect `render.yaml` and create the worker service.

## 3) Set required environment variables

### Vercel (frontend + Next.js API routes)
- `MONGODB_URI`
- `NEXTAUTH_URL` = your Vercel URL (for example `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` (or `AUTH_SECRET`)
- `RESEND_API_KEY`
- `GEMINI_API_KEY` (if used by API routes)

### `futureself-worker`
- `MONGODB_URI`
- `APP_BASE_URL` = your Vercel URL (same value as `NEXTAUTH_URL`)
- `RESEND_API_KEY`
- `GEMINI_API_KEY`
- `POLL_CRON` (optional, default `* * * * *`)

## 4) Important login fix for production

If login works locally but fails on deployment, the most common causes are:
- Missing `NEXTAUTH_URL`
- Missing `NEXTAUTH_SECRET` / `AUTH_SECRET`
- Wrong domain in `NEXTAUTH_URL`

Make sure `NEXTAUTH_URL` exactly matches your Vercel app public URL.
