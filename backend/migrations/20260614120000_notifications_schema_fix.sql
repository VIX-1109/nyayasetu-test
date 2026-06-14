-- Fix notifications table and wire up auto-notification triggers
-- Adds: is_read boolean, link text, and triggers for all notification events

-- ── 1. Add missing columns ────────────────────────────────────────────────────
alter table public.notifications
  add column if not exists is_read boolean not null default false,
  add column if not exists link text;

-- Fast index for "how many unread?" queries
create index if not exists notifications_user_unread_idx
  on public.notifications(user_id, is_read)
  where is_read = false;

-- ── 2. TRIGGER: new message → notify receiver ─────────────────────────────────
create or replace function public.notify_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sender_name text;
begin
  select coalesce(full_name, 'Someone') into sender_name
  from public.profiles where id = NEW.sender_id;

  insert into public.notifications(user_id, type, title, body, link)
  values (
    NEW.receiver_id,
    'new_message',
    'New message from ' || sender_name,
    left(NEW.content, 100),
    '/messages'
  );
  return NEW;
end;
$$;

drop trigger if exists trg_notify_new_message on public.messages;
create trigger trg_notify_new_message
  after insert on public.messages
  for each row execute function public.notify_new_message();

-- ── 3. TRIGGER: post liked → notify post author ───────────────────────────────
create or replace function public.notify_post_liked()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author_id uuid;
  liker_name text;
begin
  select author_id into post_author_id from public.posts where id = NEW.post_id;
  -- Skip if user liked their own post
  if post_author_id = NEW.user_id then return NEW; end if;

  select coalesce(full_name, 'Someone') into liker_name
  from public.profiles where id = NEW.user_id;

  insert into public.notifications(user_id, type, title, body, link)
  values (
    post_author_id,
    'post_liked',
    liker_name || ' liked your post',
    'Your post received a new reaction',
    '/feed'
  );
  return NEW;
end;
$$;

drop trigger if exists trg_notify_post_liked on public.post_reactions;
create trigger trg_notify_post_liked
  after insert on public.post_reactions
  for each row execute function public.notify_post_liked();

-- ── 4. TRIGGER: post commented → notify post author ──────────────────────────
create or replace function public.notify_post_commented()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author_id uuid;
  commenter_name text;
begin
  select author_id into post_author_id from public.posts where id = NEW.post_id;
  -- Skip if user commented on their own post
  if post_author_id = NEW.author_id then return NEW; end if;

  select coalesce(full_name, 'Someone') into commenter_name
  from public.profiles where id = NEW.author_id;

  insert into public.notifications(user_id, type, title, body, link)
  values (
    post_author_id,
    'post_commented',
    commenter_name || ' commented on your post',
    left(NEW.content, 100),
    '/feed'
  );
  return NEW;
end;
$$;

drop trigger if exists trg_notify_post_commented on public.post_comments;
create trigger trg_notify_post_commented
  after insert on public.post_comments
  for each row execute function public.notify_post_commented();

-- ── 5. TRIGGER: appointment confirmed / cancelled → notify client ─────────────
create or replace function public.notify_appointment_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.status = 'confirmed' and OLD.status is distinct from 'confirmed' then
    insert into public.notifications(user_id, type, title, body, link)
    values (
      NEW.client_id,
      'appointment_confirmed',
      'Appointment confirmed',
      'Your appointment has been confirmed by the advocate',
      '/client'
    );
  elsif NEW.status = 'cancelled' and OLD.status is distinct from 'cancelled' then
    insert into public.notifications(user_id, type, title, body, link)
    values (
      NEW.client_id,
      'appointment_cancelled',
      'Appointment cancelled',
      'Your appointment has been cancelled',
      '/client'
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_notify_appointment_status on public.appointments;
create trigger trg_notify_appointment_status
  after update of status on public.appointments
  for each row execute function public.notify_appointment_status();

-- ── 6. TRIGGER: advocate verification approved / rejected → notify advocate ───
create or replace function public.notify_verification_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.verification_status = 'verified' and OLD.verification_status is distinct from 'verified' then
    insert into public.notifications(user_id, type, title, body, link)
    values (
      NEW.id,
      'verification_approved',
      'Verification approved',
      'Your advocate profile has been verified. You can now accept consultations.',
      '/advocate'
    );
  elsif NEW.verification_status = 'rejected' and OLD.verification_status is distinct from 'rejected' then
    insert into public.notifications(user_id, type, title, body, link)
    values (
      NEW.id,
      'verification_rejected',
      'Verification not approved',
      'Your advocate verification was not approved. Please contact support.',
      '/advocate'
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_notify_verification_status on public.advocates;
create trigger trg_notify_verification_status
  after update of verification_status on public.advocates
  for each row execute function public.notify_verification_status();
