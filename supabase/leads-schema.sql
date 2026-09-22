-- School of Hope International — contact form leads.
--
-- How to run: Supabase dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
-- Safe to re-run (uses "if not exists" / drop-then-create guards throughout).
--
-- Security model: this is a PUBLIC contact form, so anyone (no login) can INSERT a lead —
-- that's the whole point of a contact form. But nobody except an authenticated admin can
-- READ, UPDATE, or DELETE leads — a visitor can submit their own info but can never see
-- anyone else's. This is the opposite shape from the blog's RLS (public read / admin
-- write) and deliberately so, since leads contain personal contact info.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  source_page text,
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

drop policy if exists "Anyone can submit a lead" on leads;
create policy "Anyone can submit a lead"
  on leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read leads" on leads;
create policy "Authenticated can read leads"
  on leads for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update leads" on leads;
create policy "Authenticated can update leads"
  on leads for update
  to authenticated
  using (true);

drop policy if exists "Authenticated can delete leads" on leads;
create policy "Authenticated can delete leads"
  on leads for delete
  to authenticated
  using (true);
