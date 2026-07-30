-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query -> Run).

create extension if not exists pgcrypto;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  date date not null,
  time text not null,
  created_at timestamptz not null default now(),
  unique (date, time)
);

alter table public.appointments enable row level security;

-- Anyone (customers, not logged in) can book an appointment.
create policy "public can insert appointments"
  on public.appointments
  for insert
  to anon, authenticated
  with check (true);

-- Logged-in admin (the barber) can see every column, including phone numbers.
create policy "authenticated can read all appointments"
  on public.appointments
  for select
  to authenticated
  using (true);

-- Logged-in admin can delete appointments.
create policy "authenticated can delete appointments"
  on public.appointments
  for delete
  to authenticated
  using (true);

-- Logged-in admin can reschedule appointments (change date/time).
create policy "authenticated can update appointments"
  on public.appointments
  for update
  to authenticated
  using (true)
  with check (true);

-- Anyone can check which slots are taken, but only date+time (no name/phone),
-- enforced via column-level grants below combined with a select policy.
create policy "public can read slot availability"
  on public.appointments
  for select
  to anon
  using (true);

revoke all on public.appointments from anon, authenticated;

-- id is included so a customer's own browser can look up (and confirm) the single
-- appointment it booked, by the id it received back at booking time - not a privacy
-- issue since it's an unguessable UUID and no name/phone is exposed alongside it.
grant select (id, date, time) on public.appointments to anon;
grant insert (customer_name, phone, date, time) on public.appointments to anon, authenticated;
grant select on public.appointments to authenticated;
grant update (customer_name, phone, date, time) on public.appointments to authenticated;
grant delete on public.appointments to authenticated;

-- After running this, create the barber's admin login under
-- Authentication -> Users -> Add user (email + password) in the Supabase dashboard.
