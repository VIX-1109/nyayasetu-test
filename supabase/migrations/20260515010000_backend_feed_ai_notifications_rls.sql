-- NyayaSetu backend foundation for the prototype feed, moderation, AI history,
-- notifications, and safer admin permissions.

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'client');

  if requested_role not in ('client', 'advocate', 'admin') then
    requested_role := 'client';
  end if;

  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), 'NyayaSetu Member'),
    requested_role
  )
  on conflict (id) do update
    set name = excluded.name,
        role = excluded.role;

  return new;
end;
$$;

drop policy if exists "Allow updates to advocates" on public.advocates;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'advocates'
      and policyname = 'Admins can insert advocate records'
  ) then
    create policy "Admins can insert advocate records"
      on public.advocates
      for insert
      with check (public.is_admin());
  end if;
end $$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'Short Update',
  category text not null default 'General',
  content text not null,
  status text not null default 'published',
  is_anonymous boolean not null default false,
  author_verified boolean not null default false,
  reactions_count integer not null default 0,
  comments_count integer not null default 0,
  reports_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_content_not_blank check (length(trim(content)) > 0),
  constraint posts_status_check check (status in ('draft', 'published', 'hidden', 'removed')),
  constraint posts_type_check check (type in ('Short Update', 'Article', 'Legal News', 'Help Request'))
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint post_comments_content_not_blank check (length(trim(content)) > 0),
  constraint post_comments_status_check check (status in ('published', 'hidden', 'removed'))
);

create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null default 'support',
  created_at timestamptz not null default now(),
  constraint post_reactions_reaction_check check (reaction in ('support')),
  unique(post_id, user_id)
);

create table if not exists public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason text not null default 'needs_review',
  status text not null default 'open',
  admin_notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint post_reports_status_check check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  unique(post_id, reporter_id)
);

create table if not exists public.ai_queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  question text not null,
  answer_summary text,
  category text,
  created_at timestamptz not null default now(),
  constraint ai_queries_question_not_blank check (length(trim(question)) > 0)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notifications_title_not_blank check (length(trim(title)) > 0)
);

create index if not exists posts_author_id_idx on public.posts(author_id);
create index if not exists posts_status_created_at_idx on public.posts(status, created_at desc);
create index if not exists posts_category_idx on public.posts(category);
create index if not exists post_comments_post_id_created_at_idx on public.post_comments(post_id, created_at);
create index if not exists post_reactions_post_id_idx on public.post_reactions(post_id);
create index if not exists post_reactions_user_id_idx on public.post_reactions(user_id);
create index if not exists post_reports_status_created_at_idx on public.post_reports(status, created_at desc);
create index if not exists ai_queries_user_id_created_at_idx on public.ai_queries(user_id, created_at desc);
create index if not exists notifications_user_id_created_at_idx on public.notifications(user_id, created_at desc);
create index if not exists appointments_client_id_idx on public.appointments(client_id);
create index if not exists appointments_advocate_id_idx on public.appointments(advocate_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists messages_receiver_id_idx on public.messages(receiver_id);
create index if not exists post_comments_author_id_idx on public.post_comments(author_id);
create index if not exists post_reports_reporter_id_idx on public.post_reports(reporter_id);
create index if not exists post_reports_reviewed_by_idx on public.post_reports(reviewed_by);

create or replace function public.refresh_post_counts(target_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set comments_count = (
        select count(*)::integer from public.post_comments
        where post_id = target_post_id and status = 'published'
      ),
      reactions_count = (
        select count(*)::integer from public.post_reactions
        where post_id = target_post_id
      ),
      reports_count = (
        select count(*)::integer from public.post_reports
        where post_id = target_post_id and status in ('open', 'reviewing')
      ),
      updated_at = now()
  where id = target_post_id;
end;
$$;

create or replace function public.sync_post_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_post_id uuid;
begin
  target_post_id := coalesce(new.post_id, old.post_id);
  perform public.refresh_post_counts(target_post_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists post_comments_set_updated_at on public.post_comments;
create trigger post_comments_set_updated_at
  before update on public.post_comments
  for each row execute function public.set_updated_at();

drop trigger if exists post_reports_set_updated_at on public.post_reports;
create trigger post_reports_set_updated_at
  before update on public.post_reports
  for each row execute function public.set_updated_at();

drop trigger if exists post_comments_sync_counts on public.post_comments;
create trigger post_comments_sync_counts
  after insert or update or delete on public.post_comments
  for each row execute function public.sync_post_counts();

drop trigger if exists post_reactions_sync_counts on public.post_reactions;
create trigger post_reactions_sync_counts
  after insert or update or delete on public.post_reactions
  for each row execute function public.sync_post_counts();

drop trigger if exists post_reports_sync_counts on public.post_reports;
create trigger post_reports_sync_counts
  after insert or update or delete on public.post_reports
  for each row execute function public.sync_post_counts();

alter table public.posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.post_reports enable row level security;
alter table public.ai_queries enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select
  using (status = 'published' or auth.uid() = author_id or public.is_admin());

drop policy if exists "Logged in users can create posts" on public.posts;
drop policy if exists "Users can create own posts" on public.posts;
create policy "Users can create own posts"
  on public.posts for insert
  with check (auth.uid() = author_id and status in ('draft', 'published'));

drop policy if exists "Authors can update own posts" on public.posts;
create policy "Authors can update own posts"
  on public.posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Admins can moderate posts" on public.posts;
create policy "Admins can moderate posts"
  on public.posts for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authors and admins can delete posts" on public.posts;
create policy "Authors and admins can delete posts"
  on public.posts for delete
  using (auth.uid() = author_id or public.is_admin());

drop policy if exists "Public can read published comments" on public.post_comments;
create policy "Public can read published comments"
  on public.post_comments for select
  using (
    status = 'published'
    and exists (
      select 1 from public.posts
      where posts.id = post_comments.post_id
        and posts.status = 'published'
    )
  );

drop policy if exists "Logged in users can comment" on public.post_comments;
drop policy if exists "Users can create own comments" on public.post_comments;
create policy "Users can create own comments"
  on public.post_comments for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.posts
      where posts.id = post_comments.post_id
        and posts.status = 'published'
    )
  );

drop policy if exists "Comment authors can update comments" on public.post_comments;
create policy "Comment authors can update comments"
  on public.post_comments for update
  using (auth.uid() = author_id or public.is_admin())
  with check (auth.uid() = author_id or public.is_admin());

drop policy if exists "Comment authors and admins can delete comments" on public.post_comments;
create policy "Comment authors and admins can delete comments"
  on public.post_comments for delete
  using (auth.uid() = author_id or public.is_admin());

drop policy if exists "Public can read reactions on published posts" on public.post_reactions;
create policy "Public can read reactions on published posts"
  on public.post_reactions for select
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_reactions.post_id
        and posts.status = 'published'
    )
  );

drop policy if exists "Logged in users can react" on public.post_reactions;
drop policy if exists "Users can react to published posts" on public.post_reactions;
create policy "Users can react to published posts"
  on public.post_reactions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.posts
      where posts.id = post_reactions.post_id
        and posts.status = 'published'
    )
  );

drop policy if exists "Users can remove own reactions" on public.post_reactions;
create policy "Users can remove own reactions"
  on public.post_reactions for delete
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Reporters and admins can read reports" on public.post_reports;
create policy "Reporters and admins can read reports"
  on public.post_reports for select
  using (auth.uid() = reporter_id or public.is_admin());

drop policy if exists "Logged in users can report posts" on public.post_reports;
drop policy if exists "Users can report posts" on public.post_reports;
create policy "Users can report posts"
  on public.post_reports for insert
  with check (auth.uid() = reporter_id);

drop policy if exists "Admins can manage reports" on public.post_reports;
create policy "Admins can manage reports"
  on public.post_reports for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read own AI history" on public.ai_queries;
create policy "Users can read own AI history"
  on public.ai_queries for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create own AI history" on public.ai_queries;
create policy "Users can create own AI history"
  on public.ai_queries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own notifications" on public.notifications;
create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can mark own notifications read" on public.notifications;
create policy "Users can mark own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins can create notifications" on public.notifications;
create policy "Admins can create notifications"
  on public.notifications for insert
  with check (public.is_admin());

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.refresh_post_counts(uuid) from public, anon, authenticated;
revoke execute on function public.sync_post_counts() from public, anon, authenticated;
grant execute on function public.is_admin(uuid) to anon, authenticated;
