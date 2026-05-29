# NyayaSetu Implementation Plan

NyayaSetu is currently implemented as a modular monolith using Next.js, Supabase, and a separated backend module layer.

The goal is to keep the MVP fast to build while still organizing the code in a way that can grow into a larger legal-tech platform.

## Current Architecture

```txt
frontend/
  app/
    api/              Next.js server routes
    ...               pages and route entries
  src/
    components/       reusable UI
    hooks/            client-side feature hooks
    lib/              Supabase/browser helpers
    screens/          major app screens
    services/         frontend client helpers

backend/
  controllers/        request/API handling
  services/           business rules and workflows
  repositories/       Supabase/Postgres access
  interfaces/         module contracts
  migrations/         database schema and RLS
```

## Runtime Backend

The backend currently runs through:

- Next.js API routes in `frontend/app/api/`
- Supabase Auth
- Supabase Postgres
- Supabase RLS policies
- Supabase RPC functions and triggers

The API routes should stay thin. New backend logic should follow:

```txt
API route -> controller -> service -> repository -> Supabase
```

## Implemented MVP Areas

- Authentication and profile handling
- Email verification prompt
- Forgot/reset password flow
- Role separation for client, advocate, and admin
- Advocate verification data and RLS hardening
- Advocate discovery/profile support
- Justice Feed data model
- Secure messaging route
- Admin promotion route
- Profile avatar support
- AI legal learning prototype
- Basic AI query history
- Custom 404 page
- Vercel deployment notes

## Near-Term Priorities

1. Complete appointment booking UI.
2. Add tests for auth, messaging, admin promotion, and advocate verification.
3. Move more feature logic into backend modules:
   - feed
   - advocates
   - appointments
   - AI query history
4. Improve mobile responsiveness page by page.
5. Clean or remove old generated output that is not part of the current Next.js app.

## On Hold

Real paid AI integration is intentionally on hold for the MVP. The AI assistant can remain a prototype until there is budget, investor interest, or mentor validation.

Before connecting paid AI, add server-side rate limiting and cost controls.

## Deployment Rule

The active app is inside `frontend/`.

For Vercel, the project should use:

- Root Directory: `frontend`
- Framework: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`

Do not deploy the old root `build/` folder.
