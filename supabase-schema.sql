-- Wildaïna Charles website CMS
-- Run this in a DEDICATED Supabase project, not in an unrelated production database.

create table if not exists public.wildaina_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.wildaina_gallery (
  id bigint generated always as identity primary key,
  title text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.wildaina_videos (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null default 'Video',
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.wildaina_admins enable row level security;
alter table public.wildaina_gallery enable row level security;
alter table public.wildaina_videos enable row level security;

create policy "admins can read own authorization"
on public.wildaina_admins for select to authenticated
using (user_id = auth.uid());

create policy "public can read gallery"
on public.wildaina_gallery for select to anon, authenticated
using (true);

create policy "authorized admins can insert gallery"
on public.wildaina_gallery for insert to authenticated
with check (exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid()));

create policy "authorized admins can update gallery"
on public.wildaina_gallery for update to authenticated
using (exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid()));

create policy "authorized admins can delete gallery"
on public.wildaina_gallery for delete to authenticated
using (exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid()));

create policy "public can read videos"
on public.wildaina_videos for select to anon, authenticated
using (true);

create policy "authorized admins can insert videos"
on public.wildaina_videos for insert to authenticated
with check (exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid()));

create policy "authorized admins can update videos"
on public.wildaina_videos for update to authenticated
using (exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid()));

create policy "authorized admins can delete videos"
on public.wildaina_videos for delete to authenticated
using (exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid()));

insert into storage.buckets (id, name, public)
values ('wildaina-media', 'wildaina-media', true)
on conflict (id) do update set public = true;

create policy "public can view Wildaina media"
on storage.objects for select to anon, authenticated
using (bucket_id = 'wildaina-media');

create policy "authorized admins can upload Wildaina media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'wildaina-media'
  and exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid())
);

create policy "authorized admins can update Wildaina media"
on storage.objects for update to authenticated
using (
  bucket_id = 'wildaina-media'
  and exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid())
)
with check (
  bucket_id = 'wildaina-media'
  and exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid())
);

create policy "authorized admins can delete Wildaina media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'wildaina-media'
  and exists (select 1 from public.wildaina_admins a where a.user_id = auth.uid())
);

-- After creating the admin user in Supabase Authentication, authorize ONLY that user:
-- insert into public.wildaina_admins (user_id) values ('PASTE_AUTH_USER_UUID_HERE');
