-- School of Hope International — blog schema and security policies.
--
-- How to run: Supabase dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
-- Safe to re-run (uses "if not exists" / "if exists" guards throughout).
--
-- Bilingual model: each post is ONE row with separate ES and EN fields (title_es/title_en,
-- excerpt_es/excerpt_en, body_es/body_en). Write only the languages you have — the public
-- site shows whichever language matches the visitor's ES/EN toggle, and falls back to
-- whichever language you actually filled in if only one exists.
--
-- Security model for this MVP:
--   - Anyone can READ published posts (public blog).
--   - Only an AUTHENTICATED Supabase user can create/edit/delete posts or upload images.
--   - There is no public sign-up form anywhere on the site — the only way to become an
--     authenticated admin is for you to create a user yourself in
--     Supabase dashboard -> Authentication -> Users -> Add user.
--     Also turn OFF "Allow new users to sign up" under Authentication -> Sign In / Providers
--     -> Email, so nobody can self-register into the same authenticated role.

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_es text,
  title_en text,
  excerpt_es text,
  excerpt_en text,
  body_es text,
  body_en text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Brings an existing table (from an earlier single-language version of this file) up to date.
alter table posts add column if not exists title_es text;
alter table posts add column if not exists title_en text;
alter table posts add column if not exists excerpt_es text;
alter table posts add column if not exists excerpt_en text;
alter table posts add column if not exists body_es text;
alter table posts add column if not exists body_en text;
alter table posts drop column if exists title;
alter table posts drop column if exists excerpt;
alter table posts drop column if exists body;
alter table posts drop column if exists lang;

alter table posts enable row level security;

drop policy if exists "Public can read published posts" on posts;
create policy "Public can read published posts"
  on posts for select
  using (status = 'published');

drop policy if exists "Authenticated can read all posts" on posts;
create policy "Authenticated can read all posts"
  on posts for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert posts" on posts;
create policy "Authenticated can insert posts"
  on posts for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update posts" on posts;
create policy "Authenticated can update posts"
  on posts for update
  to authenticated
  using (true);

drop policy if exists "Authenticated can delete posts" on posts;
create policy "Authenticated can delete posts"
  on posts for delete
  to authenticated
  using (true);

-- keep updated_at current on every edit
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- Storage bucket for cover/inline images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

drop policy if exists "Authenticated can upload blog images" on storage.objects;
create policy "Authenticated can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated can update blog images" on storage.objects;
create policy "Authenticated can update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "Authenticated can delete blog images" on storage.objects;
create policy "Authenticated can delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');
