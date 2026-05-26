/*
  Security hardening and MVP data tables.

  This migration keeps admin role changes and message sender identity out of
  frontend-controlled updates. It also fixes advocate profile updates so a
  verified advocate can edit non-critical fields without losing verification.
*/

create extension if not exists pgcrypto;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  advocate_id uuid not null references public.advocates(id) on delete cascade,
  scheduled_at timestamptz not null,
  mode text not null default 'online',
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_mode_check check (mode in ('online', 'phone', 'in_person')),
  constraint appointments_status_check check (status in ('pending', 'confirmed', 'cancelled', 'completed'))
);

create table if not exists public.ai_queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  question text not null,
  answer_summary text,
  category text,
  created_at timestamptz not null default now(),
  constraint ai_queries_question_not_blank check (length(trim(question)) > 0)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint messages_content_not_blank check (length(trim(content)) > 0)
);

alter table public.appointments enable row level security;
alter table public.ai_queries enable row level security;
alter table public.messages enable row level security;
alter table public.advocates enable row level security;

create or replace function public.promote_user_to_admin(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Only admins can promote users';
  end if;

  perform set_config('app.allow_admin_promotion', 'true', true);

  update public.profiles
  set role = 'admin',
      updated_at = now()
  where id = p_user_id;
end;
$$;

grant execute on function public.promote_user_to_admin(uuid) to authenticated;

create or replace function public.guard_admin_role_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'admin'
     and old.role is distinct from new.role
     and current_setting('app.allow_admin_promotion', true) is distinct from 'true' then
    raise exception 'Admin role changes must use the server promotion function';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_admin_role_changes on public.profiles;
create trigger guard_admin_role_changes
before update of role on public.profiles
for each row execute function public.guard_admin_role_changes();

create or replace function public.prevent_advocate_self_verification_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin(auth.uid()) then
    return new;
  end if;

  if auth.uid() = old.id and (
    new.admin_verified is distinct from old.admin_verified or
    new.bar_verified is distinct from old.bar_verified
  ) then
    raise exception 'Advocate verification can only be changed by an admin';
  end if;

  if auth.uid() = old.id and new.bar_council_number is distinct from old.bar_council_number then
    new.admin_verified := false;
    new.bar_verified := false;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_advocate_self_verification_change on public.advocates;
create trigger prevent_advocate_self_verification_change
before update on public.advocates
for each row execute function public.prevent_advocate_self_verification_change();

drop policy if exists "Advocates can update own unapproved profile" on public.advocates;
drop policy if exists "Advocates can update own profile" on public.advocates;
create policy "Advocates can update own profile" on public.advocates
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists appointments_insert_client on public.appointments;
drop policy if exists appointments_select_participant on public.appointments;
drop policy if exists appointments_update_participant on public.appointments;
create policy appointments_insert_client on public.appointments
  for insert to authenticated
  with check (auth.uid() = client_id);
create policy appointments_select_participant on public.appointments
  for select to authenticated
  using (auth.uid() = client_id or auth.uid() = advocate_id or public.is_admin(auth.uid()));
create policy appointments_update_participant on public.appointments
  for update to authenticated
  using (auth.uid() = client_id or auth.uid() = advocate_id or public.is_admin(auth.uid()))
  with check (auth.uid() = client_id or auth.uid() = advocate_id or public.is_admin(auth.uid()));

drop policy if exists ai_queries_insert_self on public.ai_queries;
drop policy if exists ai_queries_select_self on public.ai_queries;
drop policy if exists ai_queries_admin_select on public.ai_queries;
create policy ai_queries_insert_self on public.ai_queries
  for insert to authenticated
  with check (auth.uid() = user_id);
create policy ai_queries_select_self on public.ai_queries
  for select to authenticated
  using (auth.uid() = user_id);
create policy ai_queries_admin_select on public.ai_queries
  for select to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists messages_insert_sender on public.messages;
drop policy if exists messages_select_participant on public.messages;
drop policy if exists messages_update_receiver_read on public.messages;
create policy messages_insert_sender on public.messages
  for insert to authenticated
  with check (auth.uid() = sender_id);
create policy messages_select_participant on public.messages
  for select to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id or public.is_admin(auth.uid()));
create policy messages_update_receiver_read on public.messages
  for update to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);
