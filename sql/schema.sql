-- Enable required extensions (if not enabled)
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Users profile
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Couples
create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Our Couple',
  created_at timestamptz default now()
);

-- Membership
create table if not exists couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','member')),
  created_at timestamptz default now(),
  unique (couple_id, user_id)
);

-- Albums
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  name text not null,
  emoji text,
  created_at timestamptz default now()
);

-- Moments
create table if not exists moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  album_id uuid references albums(id) on delete set null,
  title text,
  caption text,
  happened_at date not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Photos
create table if not exists moment_photos (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references moments(id) on delete cascade,
  storage_path text not null,
  width int,
  height int,
  created_at timestamptz default now()
);

-- Tags
create table if not exists moment_tags (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz default now(),
  unique (couple_id, name)
);

create table if not exists moment_tag_links (
  moment_id uuid not null references moments(id) on delete cascade,
  tag_id uuid not null references moment_tags(id) on delete cascade,
  primary key (moment_id, tag_id)
);

-- Reactions
create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references moments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz default now(),
  unique (moment_id, user_id, emoji)
);

-- Comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references moments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);
