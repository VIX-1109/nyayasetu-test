-- NyayaSetu auth/profile hardening for modular monolith prototype.
-- Keeps account rules in the database so users cannot bypass the frontend.

alter table public.profiles
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists language text,
  add column if not exists bio text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('client', 'advocate', 'admin'));
  end if;
end $$;

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

  -- Public signup can only create client or advocate accounts.
  -- Admin accounts must be created by the platform owner/admin path.
  if requested_role not in ('client', 'advocate') then
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
        updated_at = now();

  return new;
end;
$$;

create or replace function public.prevent_profile_self_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin(auth.uid()) then
    return new;
  end if;

  if auth.uid() = old.id and new.role is distinct from old.role then
    raise exception 'Users cannot change their own role';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_self_privilege_escalation on public.profiles;
create trigger profiles_prevent_self_privilege_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_self_privilege_escalation();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable for app relationships" on public.profiles;
create policy "Profiles are readable for app relationships"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id and role in ('client', 'advocate'));

drop policy if exists "Users can update safe own profile fields" on public.profiles;
create policy "Users can update safe own profile fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

alter table public.advocates enable row level security;

drop policy if exists "Public can read verified advocates" on public.advocates;
create policy "Public can read verified advocates"
  on public.advocates for select
  using (verification_status = 'verified' or auth.uid() = id or public.is_admin());

drop policy if exists "Advocates can submit own profile for review" on public.advocates;
create policy "Advocates can submit own profile for review"
  on public.advocates for insert
  with check (
    auth.uid() = id
    and coalesce(admin_verified, false) = false
    and coalesce(bar_verified, false) = false
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'advocate'
    )
  );

drop policy if exists "Advocates can update own unapproved profile" on public.advocates;
create policy "Advocates can update own unapproved profile"
  on public.advocates for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and coalesce(admin_verified, false) = false
    and coalesce(bar_verified, false) = false
  );

drop policy if exists "Admins can manage advocate verification" on public.advocates;
create policy "Admins can manage advocate verification"
  on public.advocates for all
  using (public.is_admin())
  with check (public.is_admin());

revoke execute on function public.prevent_profile_self_privilege_escalation() from public, anon, authenticated;
