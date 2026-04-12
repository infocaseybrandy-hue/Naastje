-- Supabase Database Schema for Naastje

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  type text not null check (type in ('zorgzoeker', 'zorgaanbieder')),
  subtype text,
  name text not null,
  photo text,
  description text,
  location text,
  gender text check (gender in ('man', 'vrouw', 'anders')),
  religion text,
  birth_date text,
  interests text[] default '{}',
  availability_hours integer,
  availability_times text[] default '{}',
  education text[] default '{}',
  diplomas text[] default '{}',
  categories text[] default '{}',
  is_premium boolean default false,
  has_pets boolean,
  pet_type text,
  cleaning_products text check (cleaning_products in ('mee', 'zelf', 'geen_voorkeur')),
  need_cleaning_supplies boolean,
  search_tasks text[] default '{}',
  other_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Likes table
create table likes (
  id uuid primary key default uuid_generate_v4(),
  from_user_id uuid references profiles(id) on delete cascade not null,
  to_user_id uuid references profiles(id) on delete cascade not null,
  direction text not null check (direction in ('left', 'right')),
  created_at timestamptz default now(),
  unique(from_user_id, to_user_id)
);

-- Matches table
create table matches (
  id uuid primary key default uuid_generate_v4(),
  user1 uuid references profiles(id) on delete cascade not null,
  user2 uuid references profiles(id) on delete cascade not null,
  matched_at timestamptz default now(),
  unique(user1, user2)
);

-- Messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade not null,
  from_user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  sent_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table likes enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;

-- Profile policies
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Anyone can view profiles" on profiles
  for select using (true);

-- Likes policies
create policy "Users can view their own likes" on likes
  for select using (auth.uid() = from_user_id);

create policy "Users can insert their own likes" on likes
  for insert with check (auth.uid() = from_user_id);

-- Matches policies
create policy "Users can view their matches" on matches
  for select using (auth.uid() = user1 or auth.uid() = user2);

-- Messages policies
create policy "Users can view messages in their matches" on messages
  for select using (
    exists (
      select 1 from matches
      where matches.id = messages.match_id
      and (matches.user1 = auth.uid() or matches.user2 = auth.uid())
    )
  );

create policy "Users can insert messages in their matches" on messages
  for insert with check (
    exists (
      select 1 from matches
      where matches.id = messages.match_id
      and (matches.user1 = auth.uid() or matches.user2 = auth.uid())
    )
  );

-- Create indexes
create index idx_likes_from_user on likes(from_user_id);
create index idx_likes_to_user on likes(to_user_id);
create index idx_matches_user1 on matches(user1);
create index idx_matches_user2 on matches(user2);
create index idx_messages_match on messages(match_id);
create index idx_messages_from_user on messages(from_user_id);

-- Posts table (for explore/berichten feed)
create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  image text,
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now()
);

-- Comments table
create table comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- Post likes table
create table post_likes (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- Enable RLS for new tables
alter table posts enable row level security;
alter table comments enable row level security;
alter table post_likes enable row level security;

-- Posts policies
create policy "Anyone can view posts" on posts
  for select using (true);

create policy "Users can insert their own posts" on posts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own posts" on posts
  for update using (auth.uid() = user_id);

create policy "Users can delete own posts" on posts
  for delete using (auth.uid() = user_id);

-- Comments policies
create policy "Anyone can view comments" on comments
  for select using (true);

create policy "Users can insert comments" on comments
  for insert with check (auth.uid() = user_id);

-- Post likes policies
create policy "Users can view post likes" on post_likes
  for select using (true);

create policy "Users can insert post likes" on post_likes
  for insert with check (auth.uid() = user_id);

-- Create indexes
create index idx_posts_user on posts(user_id);
create index idx_posts_created on posts(created_at desc);
create index idx_comments_post on comments(post_id);
create index idx_post_likes_post on post_likes(post_id);

-- RPC functions for likes counting
create or replace function increment_likes(post_id uuid)
returns void as $$
begin
  update posts set likes_count = likes_count + 1 where id = post_id;
end;
$$ language plpgsql security definer;

create or replace function decrement_likes(post_id uuid)
returns void as $$
begin
  update posts set likes_count = greatest(likes_count - 1, 0) where id = post_id;
end;
$$ language plpgsql security definer;