# Project Overview

React/Vite video downloader application migrated to run on Replit with an Express server for download and video metadata APIs.

# Architecture

- Frontend: React, Vite, TypeScript, Tailwind, shadcn/ui components in `src/`.
- Backend: Express API in `server/index.ts` running on port 3000 during development.
- Database: Replit PostgreSQL with Drizzle schema in `shared/schema.ts` and configuration in `drizzle.config.ts`.
- API flow: browser calls relative `/api/video-info` and `/api/download`; Vite proxies those requests to the Express server.
- YouTube metadata and downloads: server uses `ytdl-core` first, then local `yt-dlp` fallbacks for metadata and downloads so YouTube links can work without relying on `RAPIDAPI_KEY`.
- Video info lookups are cached in memory for 5 minutes to reduce repeat processing time for the same link.
- Download UX: frontend submits downloads directly to the browser instead of buffering the whole file as a Blob first, reducing perceived processing time and memory usage.
- Queue UX: homepage and platform pages accept multiple pasted links, process them sequentially, and show per-link queued/processing/ready/failed states with download options for ready items.

# Migration Notes

- Removed Supabase client and Edge Function code.
- RapidAPI secret is read only on the server via `RAPIDAPI_KEY`.
- `npm run dev` starts both the API server and Vite dev server.

# Render Deployment

- `render.yaml` configures the Render service (web, Node runtime).
- `build.sh` installs yt-dlp (via pip), ffmpeg (via apt), Node deps, and builds the frontend.
- `npm start` runs `tsx server/index.ts` in production mode.
- In production (`NODE_ENV=production`), the Express server serves the built `dist/` folder and handles SPA routing.
- Set `RAPIDAPI_KEY` in Render environment variables for non-YouTube platform support.
- Render will assign a `PORT` env var automatically; the server reads it via `process.env.PORT`.
