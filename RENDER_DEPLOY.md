# Deploy FutureSelf on Render

This repo now includes a root `render.yaml` blueprint that deploys:
- `futureself-web` (Next.js app + API routes)
- `futureself-worker` (background reminder worker)

## 1) Push this repo to GitHub

Render Blueprint deploys from a Git repository.

## 2) Create services from Blueprint

1. In Render, click **New +** -> **Blueprint**.
2. Select this repository.
3. Render will detect `render.yaml` and create both services.

## 3) Set required environment variables

### `futureself-web`
- `MONGODB_URI`
- `NEXTAUTH_URL` = your web service URL (for example `https://futureself-web.onrender.com`)
- `NEXTAUTH_SECRET` (or `AUTH_SECRET`)
- `RESEND_API_KEY`
- `GEMINI_API_KEY` (if used by web routes)

### `futureself-worker`
- `MONGODB_URI`
- `APP_BASE_URL` = your web service URL (same as `NEXTAUTH_URL`)
- `RESEND_API_KEY`
- `GEMINI_API_KEY`
- `POLL_CRON` (optional, default `* * * * *`)

## 4) Important login fix for production

If login works locally but fails on deployment, the most common causes are:
- Missing `NEXTAUTH_URL`
- Missing `NEXTAUTH_SECRET` / `AUTH_SECRET`
- Wrong domain in `NEXTAUTH_URL`

Make sure `NEXTAUTH_URL` exactly matches your Render web app public URL.
