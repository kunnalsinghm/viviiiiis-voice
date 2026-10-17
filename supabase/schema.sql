create table if not exists songs(
 id uuid primary key default gen_random_uuid(), title text not null, audio_url text not null default '',
 artwork_url text, category text not null default 'Songs', year int, lyrics text, description text,
 personal_note text, duration int, created_at timestamptz default now());
alter table songs enable row level security;
create policy "public read" on songs for select using (true);
create policy "admin write" on songs for all to authenticated using (true) with check (true);
insert into storage.buckets(id,name,public) values('vivi','vivi',true) on conflict do nothing;
create policy "public read files" on storage.objects for select using (bucket_id='vivi');
create policy "admin files" on storage.objects for all to authenticated using (bucket_id='vivi') with check (bucket_id='vivi');
-- Demo songs (silent; delete them in /admin once you upload real ones)
insert into songs(title,category,year,lyrics,personal_note,description) values
('Midnight Song','Songs',2023,E'Soft light, slow night\nYour voice is all I need','You sang this late one night and I stayed awake just to hear it again.','Demo recording'),
('Rainy Evening','Voice Notes',2022,E'Rain on the window\nHumming along','A rainy evening I never want to forget.','Demo recording'),
('Little Melody','Covers',2021,null,'Tiny and perfect.','Demo recording'),
('First Light','Unreleased',2024,null,'The first one I ever kept.','Demo recording');
