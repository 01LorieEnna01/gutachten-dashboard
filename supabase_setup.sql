-- Gutachten-Dashboard: Supabase Setup
-- Einmal im Supabase SQL Editor ausführen

create table if not exists gutachten (
  id          uuid default gen_random_uuid() primary key,
  created_at  timestamptz default now(),
  name        text not null,
  aktenzeichen text not null,
  richterin   text,
  frist       text not null,
  erledigte   jsonb default '{}'::jsonb,
  notiz       text default ''
);

-- Row Level Security: für einfachen Einzelnutzer-Betrieb alles erlauben
alter table gutachten enable row level security;

create policy "Alles erlaubt (anon)" on gutachten
  for all using (true) with check (true);

-- Optional: Realtime aktivieren für Multi-Device-Sync
-- (im Supabase Dashboard unter Table Editor → Realtime einschalten)
