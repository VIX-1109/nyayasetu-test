# Backend Implementation Plan: Supabase (BaaS)

Based on your request, we will skip building a custom Node.js/SQLite backend and instead use a Backend-as-a-Service (BaaS). I recommend **Supabase** over Firebase for this specific project because your data (Users, Advocates, Appointments, Messages) is highly relational, and Supabase uses a powerful PostgreSQL database which fits this perfectly. 

## User Review Required
> [!IMPORTANT]
> To proceed with **Supabase**, you will need to:
> 1. Create a free project at [Supabase.com](https://supabase.com).
> 2. Provide me with the `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` once created.
> 
> *Alternatively, if you strongly prefer **Firebase**, let me know and I will adjust the plan for NoSQL/Firestore.*

## Proposed Architecture Changes

Since we are moving to a BaaS, we won't need a separate `/backend` folder. Instead, we will directly integrate Supabase into your React frontend.

### 1. SDK Integration
- Install `@supabase/supabase-js`.
- Replace the current `axios` (`api.post`, `api.get`) calls in your frontend with Supabase SDK calls.
- Update `App.js`, `Auth.js`, and all dashboard pages to use Supabase Auth and Database queries.

### 2. Database Schema (Supabase PostgreSQL)
I will provide you with a SQL script to run in your Supabase SQL Editor to instantly create these tables:
1. **users**: Extends Supabase Auth with roles (client, advocate, admin) and names.
2. **advocate_profiles**: Bio, specialization, experience, verification status.
3. **appointments**: Links clients to advocates, holds dates, times, and status.
4. **messages**: Sender/receiver logic and timestamps.

### 3. Frontend Refactoring Strategy

We will update the frontend files systematically to replace the mock API calls:

#### Auth (`Auth.js`, `App.js`)
- Use `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`.
- Use `supabase.auth.getSession()` to maintain user state.

#### Advocates (`AdvocateDirectory.js`, `AdvocateProfile.js`, `AdvocateDashboard.js`)
- Use `supabase.from('advocates_view').select('*')` to list and filter advocates.

#### Appointments & Messages (`ClientDashboard.js`, `Messages.js`)
- Use Supabase queries to insert and fetch appointments and real-time chat messages.

#### AI Learning
- Supabase doesn't have a built-in AI chat endpoint natively (without edge functions). If you have an OpenAI/Gemini API key, we can call it directly from the frontend, or mock this specific feature for now.

## Verification Plan

### Manual Verification
- **Auth**: User can successfully register and login, and their data appears in your Supabase dashboard.
- **Appointments & Messages**: Data correctly reads and writes from Supabase tables without permissions errors.
