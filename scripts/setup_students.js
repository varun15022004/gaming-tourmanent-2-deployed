// Executes DDL to create students table, triggers, and RLS policies in Supabase using DATABASE_URL.
// Reads DATABASE_URL from .env.local and connects with SSL.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

(async () => {
  try {
    const conn = process.env.DATABASE_URL;
    if (!conn) {
      console.error('DATABASE_URL is missing in .env.local');
      process.exit(1);
    }

    const sql = `
create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  college_id text,
  game_preferences text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
before update on public.students
for each row execute function public.set_updated_at();

create unique index if not exists students_user_id_key on public.students(user_id);

-- RLS
alter table public.students enable row level security;

drop policy if exists "students_select_own" on public.students;
create policy "students_select_own"
on public.students for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "students_insert_own" on public.students;
create policy "students_insert_own"
on public.students for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "students_update_own" on public.students;
create policy "students_update_own"
on public.students for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
`;

    const client = new Client({
      connectionString: conn,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    await client.query(sql);
    await client.end();

    console.log('Students table, trigger, and RLS policies ensured.');
  } catch (err) {
    console.error('Failed to apply SQL:', err.message);
    process.exit(1);
  }
})();
