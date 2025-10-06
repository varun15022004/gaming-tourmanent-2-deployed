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
alter table public.students
  add column if not exists is_admin boolean not null default false;

-- Allow admins to select all rows
drop policy if exists "students_select_all_if_admin" on public.students;
create policy "students_select_all_if_admin"
on public.students for select
to authenticated
using (
  exists (
    select 1 from public.students s2
    where s2.user_id = auth.uid() and s2.is_admin = true
  )
);
`;

    const client = new Client({
      connectionString: conn,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    await client.query(sql);
    await client.end();

    console.log('Added is_admin column and admin select policy.');
  } catch (err) {
    console.error('Failed to update admin policies:', err.message);
    process.exit(1);
  }
})();
