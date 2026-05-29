# Backend

The backend folder contains the modular backend layer for NyayaSetu.

The current production runtime is still a Next.js + Supabase architecture, but the backend logic is separated into controller-service-repository modules so the project can grow cleanly without becoming a pile of API-route code.

## Layers

- `controllers/`: request/API entrypoints. Controllers parse request data, call services, and return response objects.
- `services/`: business workflows. Services enforce product rules and coordinate repositories.
- `repositories/`: persistence layer. Repositories contain Supabase/Postgres queries and RPC calls.
- `interfaces/`: module contracts. Interfaces define expected data shapes and method boundaries so different people can work independently.
- `migrations/`: database schema, RLS policies, functions, triggers, and indexes.

## Current Implemented Modules

- Admin promotion flow
- Secure message sending flow
- Supabase migrations for auth hardening, feed, appointments, AI query history, profile avatars, RLS, and verification rules

## Current Prototype Backend

NyayaSetu currently uses:

- Supabase Auth and profiles
- Supabase Postgres with RLS
- Next.js API routes in `frontend/app/api/`
- Backend modules in this folder

Current backend-supported areas include:

- Auth and profiles
- Advocate verification data
- Appointments
- Messages
- Justice Feed posts, comments, reactions, and reports
- AI query history
- Notifications

## Development Rule

Do not put business logic directly inside React pages or large API route files.

Use this flow:

```txt
API route -> controller -> service -> repository -> Supabase
```
