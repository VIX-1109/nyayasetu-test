# Backend

This backend folder is structured for a controller-service-repository architecture while the prototype uses Supabase for the actual backend runtime.

## Layers

- `controllers/`: HTTP/serverless entrypoints. Controllers validate request shape, call services, and format responses.
- `services/`: business workflows. Services decide what should happen, coordinate repositories, and enforce product rules.
- `repositories/`: persistence layer. Repositories contain Supabase/Postgres queries and should not contain UI logic.
- `interfaces/`: module contracts. Interfaces define expected data shapes and method boundaries so different people can work independently.
- `migrations/`: database schema, RLS policies, functions, triggers, and indexes.

## Current Prototype Backend

The current working backend is Supabase:

- Auth and profiles
- Advocate verification data
- Appointments
- Messages
- Justice Feed posts, comments, reactions, and reports
- AI query history
- Notifications

When a Node.js or serverless backend is introduced later, use these folders instead of placing business logic directly inside React pages.
