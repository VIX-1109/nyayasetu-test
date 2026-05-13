-- NyayaSetu prototype module schema additions.
-- Run these in Supabase SQL editor when the team is ready to persist feed,
-- reporting, AI history, and richer consultation data.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'Legal Awareness',
  category text not null default 'General',
  content text not null,
  status text not null default 'published',
  author_verified boolean not null default false,
  reactions_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  status text not null default 'published',
  created_at timestamptz not null default now()
);

create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null default 'support',
  created_at timestamptz not null default now(),
  unique(post_id, user_id, reaction)
);

create table if not exists public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason text not null default 'needs_review',
  status text not null default 'open',
  admin_notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  question text not null,
  answer_summary text,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Optional additions if the existing appointments table does not have these.
alter table public.appointments
  add column if not exists status text not null default 'pending';

-- Enable RLS before writing production policies.
alter table public.posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.post_reports enable row level security;
alter table public.ai_queries enable row level security;
alter table public.notifications enable row level security;

-- Prototype policies. Tighten before production.
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select
  using (status = 'published');

drop policy if exists "Logged in users can create posts" on public.posts;
create policy "Logged in users can create posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "Authors can update own posts" on public.posts;
create policy "Authors can update own posts"
  on public.posts for update
  using (auth.uid() = author_id);

drop policy if exists "Public can read published comments" on public.post_comments;
create policy "Public can read published comments"
  on public.post_comments for select
  using (status = 'published');

drop policy if exists "Logged in users can comment" on public.post_comments;
create policy "Logged in users can comment"
  on public.post_comments for insert
  with check (auth.uid() = author_id);

drop policy if exists "Logged in users can react" on public.post_reactions;
create policy "Logged in users can react"
  on public.post_reactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Logged in users can report posts" on public.post_reports;
create policy "Logged in users can report posts"
  on public.post_reports for insert
  with check (auth.uid() = reporter_id);

drop policy if exists "Users can read own AI history" on public.ai_queries;
create policy "Users can read own AI history"
  on public.ai_queries for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own AI history" on public.ai_queries;
create policy "Users can create own AI history"
  on public.ai_queries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own notifications" on public.notifications;
create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);
