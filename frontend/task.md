# Current Project Task Status

This file tracks implementation status for the current MVP codebase.

## Completed

- [x] Separate frontend and backend folders.
- [x] Add backend controller-service-repository folder structure.
- [x] Add backend interfaces for module contracts.
- [x] Add Supabase migrations for feed, AI query history, notifications, auth hardening, appointments, profile avatars, and RLS.
- [x] Add server-side Supabase RPC for admin promotion.
- [x] Prevent frontend self-admin role selection during signup.
- [x] Add protected route middleware.
- [x] Add forgot password and reset password flow.
- [x] Add email verification prompt/overlay.
- [x] Refactor secure message sending through `/api/message`.
- [x] Move message send logic into backend controller-service-repository modules.
- [x] Move admin promotion logic into backend controller-service-repository modules.
- [x] Add custom 404 page.
- [x] Add prototype AI query rate-limit utility.
- [x] Add profile/account menu access.
- [x] Run production build successfully.

## On Hold

- [ ] Real OpenAI/LLM integration.
- [ ] Server-side AI rate limiting for paid AI usage.

## Next Useful Tasks

- [ ] Add real tests for auth, messaging, admin promotion, and advocate verification.
- [ ] Complete appointment booking UI and wire it to Supabase.
- [ ] Move more feature areas into backend modules: feed, advocates, appointments, and AI.
- [ ] Clean old generated output folders that are no longer part of the current Next.js app.
