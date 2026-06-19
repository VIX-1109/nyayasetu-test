# NyayaSetu — Legal Awareness Platform for India

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://frontend-opal-five-99.vercel.app)
[![Vercel](https://img.shields.io/github/deployments/VIX-1109/NyayaSetu/production?label=Vercel&logo=vercel&style=flat-square)](https://frontend-opal-five-99.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com)

> **Making legal knowledge accessible to every Indian citizen — for free.**

India has 1.4 billion people and a severe shortage of legal awareness. Most people don't know their rights until it's too late. NyayaSetu bridges that gap.

**[→ Try it live: frontend-opal-five-99.vercel.app](https://frontend-opal-five-99.vercel.app)**

---

## What NyayaSetu Does

| Feature | Description |
|---------|-------------|
| **Justice Feed** | Twitter-like social feed for legal discussions, posts, and community knowledge sharing |
| **Legal News** | Live curated legal news from Bar & Bench and Indian legal sources, updated automatically |
| **Advocate Discovery** | Browse and connect with legal advocates in your area |
| **AI Legal Learning** | Ask legal questions in plain language, get simple answers using AI |
| **Secure Messaging** | Encrypted direct messages between users and advocates |
| **Smart Rankings** | Personalized feed powered by LexFeed — an ML recommendation engine |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes, Node.js |
| Database | Supabase (PostgreSQL + pgvector + Realtime) |
| Auth | Supabase Auth (email/password + OAuth) |
| AI | OpenAI GPT (legal Q&A), Groq LLaMA (classification) |
| Recommendation | LexFeed ML engine (sentence-transformers, 6-signal ranking) |
| Deployment | Vercel (frontend + API routes) |
| Legal News | Bar & Bench RSS, Google News RSS |

**Total infrastructure cost: ₹0** — built entirely on free tiers.

---

## Project Structure

```
NyayaSetu/
  frontend/           ← Next.js app (deployed on Vercel)
    app/api/          ← API routes (thin wrappers around backend/)
    src/
      screens/        ← Page components (JusticeFeed, AILawLearning, etc.)
      components/     ← Shared UI components
      hooks/          ← Custom React hooks (useJusticeFeed, etc.)
      services/       ← API clients (Supabase, LexFeed, news)
      lib/            ← Shared utilities
  backend/            ← Business logic (imported by API routes)
    controllers/      ← Request handling
    services/         ← Business rules and workflows
    repositories/     ← Supabase/Postgres access layer
    migrations/       ← Schema, RLS policies, DB functions
  docs/               ← Architecture and planning documents
```

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/VIX-1109/NyayaSetu
cd NyayaSetu/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key (see Environment section below)

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Only these go in the frontend `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_LEXFEED_API_URL=https://vix1109-lexfeed.hf.space
```

> **Security:** Never put service-role keys, database passwords, or API secrets in frontend environment files. Backend-only secrets belong in Vercel's environment variables dashboard, not in `.env.local`.

---

## LexFeed Integration

NyayaSetu's Justice Feed is powered by **[LexFeed](https://github.com/VIX-1109/lexfeed)** — a separate ML recommendation engine that ranks posts using a 6-signal scoring model. The integration is fully graceful: if LexFeed is unavailable, the feed automatically falls back to chronological order.

---

## Author

**Vighnesh Vikas Sonawane** — [@VIX-1109](https://github.com/VIX-1109)

Built with Next.js, Supabase, and AI assistance.
