-- Align appointments table with frontend booking (date/time/description + scheduled_at/notes/mode).

alter table public.appointments add column if not exists date text;
alter table public.appointments add column if not exists time text;
alter table public.appointments add column if not exists description text;
alter table public.appointments add column if not exists scheduled_at timestamptz;
alter table public.appointments add column if not exists mode text default 'online';
alter table public.appointments add column if not exists notes text;

-- Ensure RLS policies exist for participant access.
alter table public.appointments enable row level security;

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
