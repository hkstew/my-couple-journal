-- Enable RLS
alter table profiles enable row level security;
alter table couples enable row level security;
alter table couple_members enable row level security;
alter table albums enable row level security;
alter table moments enable row level security;
alter table moment_photos enable row level security;
alter table moment_tags enable row level security;
alter table moment_tag_links enable row level security;
alter table reactions enable row level security;
alter table comments enable row level security;

-- Helper function: checks if current user is a member of a couple
create or replace function is_member(c_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from couple_members cm
    where cm.couple_id = c_id and cm.user_id = auth.uid()
  );
$$;

-- Profiles
create policy "profile is self" on profiles
for select using (user_id = auth.uid());
create policy "insert self profile" on profiles
for insert with check (user_id = auth.uid());
create policy "update self profile" on profiles
for update using (user_id = auth.uid());

-- Couples: readable to members, insert allowed to authenticated (owner created via app logic)
create policy "read couples if member" on couples
for select using (is_member(id));
create policy "insert couples" on couples
for insert with check (auth.uid() is not null);

-- Couple members
create policy "read memberships if self or same couple" on couple_members
for select using (user_id = auth.uid() or is_member(couple_id));
create policy "insert membership for self" on couple_members
for insert with check (user_id = auth.uid());
create policy "delete own membership" on couple_members
for delete using (user_id = auth.uid());

-- Albums tied to couple
create policy "read albums if member" on albums
for select using (is_member(couple_id));
create policy "insert albums if member" on albums
for insert with check (is_member(couple_id));
create policy "update albums if member" on albums
for update using (is_member(couple_id));
create policy "delete albums if member" on albums
for delete using (is_member(couple_id));

-- Moments
create policy "read moments if member" on moments
for select using (is_member(couple_id));
create policy "insert moments if member" on moments
for insert with check (is_member(couple_id));
create policy "update moments if member" on moments
for update using (is_member(couple_id));
create policy "delete moments if member" on moments
for delete using (is_member(couple_id));

-- Photos (join through moment)
create policy "read photos if member" on moment_photos
for select using (exists (select 1 from moments m where m.id = moment_id and is_member(m.couple_id)));
create policy "insert photos if member" on moment_photos
for insert with check (exists (select 1 from moments m where m.id = moment_id and is_member(m.couple_id)));
create policy "delete photos if member" on moment_photos
for delete using (exists (select 1 from moments m where m.id = moment_id and is_member(m.couple_id)));

-- Tags
create policy "read tags if member" on moment_tags
for select using (is_member(couple_id));
create policy "insert tags if member" on moment_tags
for insert with check (is_member(couple_id));
create policy "delete tags if member" on moment_tags
for delete using (is_member(couple_id));

create policy "read tag links if member" on moment_tag_links
for select using (exists (select 1 from moments m join moment_tags t on t.id = tag_id where m.id = moment_id and is_member(m.couple_id)));
create policy "insert tag links if member" on moment_tag_links
for insert with check (exists (select 1 from moments m join moment_tags t on t.id = tag_id where m.id = moment_id and is_member(m.couple_id)));
create policy "delete tag links if member" on moment_tag_links
for delete using (exists (select 1 from moments m join moment_tags t on t.id = tag_id where m.id = moment_id and is_member(m.couple_id)));

-- Reactions & Comments
create policy "read reactions if member" on reactions
for select using (exists (select 1 from moments m where m.id = moment_id and is_member(m.couple_id)));
create policy "insert reactions if member" on reactions
for insert with check (exists (select 1 from moments m where m.id = moment_id and is_member(m.couple_id)));
create policy "delete own reaction" on reactions
for delete using (user_id = auth.uid());

create policy "read comments if member" on comments
for select using (exists (select 1 from moments m where m.id = moment_id and is_member(m.couple_id)));
create policy "insert comments if member" on comments
for insert with check (exists (select 1 from moments m where m.id = moment_id and is_member(m.couple_id)));
create policy "delete own comment" on comments
for delete using (user_id = auth.uid());
