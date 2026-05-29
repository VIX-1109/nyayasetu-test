# NyayaSetu
![Vercel Deployments](https://img.shields.io/github/deployments/VIX-1109/NyayaSetu/production?label=vercel&logo=vercel)

NyayaSetu is a legal-tech prototype for advocate discovery, justice-focused social posts, secure messaging, dashboards, and basic AI legal learning.

The project is organized as a modular monolith:

- `frontend/` contains the Next.js, React, Tailwind, shadcn UI, and Supabase client application deployed on Vercel.
- `backend/` contains backend controllers, services, repositories, interfaces, and Supabase migrations.
- `docs/` contains operational notes such as deployment guidance.

## Frontend

Run the web app from the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Build locally:

```bash
cd frontend
npm run build
```

The build uses webpack because the Next.js API routes import backend modules from the sibling `backend/` folder.

## Backend

The current backend runtime is:

- Next.js API routes in `frontend/app/api/`
- Supabase Auth, Postgres, RLS policies, functions, and migrations
- Shared backend modules in `backend/`

The API routes are intentionally thin wrappers. Product logic lives in:

- `backend/controllers/`: request/API handling
- `backend/services/`: business rules and workflows
- `backend/repositories/`: Supabase/Postgres access
- `backend/interfaces/`: module contracts and data shapes
- `backend/migrations/`: schema, RLS, triggers, and database functions

## Environment

Use public frontend variables only in the frontend app:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never put service-role keys, database passwords, OpenAI secrets, or payment secrets in frontend env files.
