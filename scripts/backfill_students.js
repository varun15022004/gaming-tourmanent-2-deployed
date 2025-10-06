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
insert into public.students (user_id, email, full_name, college_id)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', u.email),
  (u.raw_user_meta_data->>'college_id')
from auth.users u
left join public.students s on s.user_id = u.id
where s.user_id is null;
`;

    const client = new Client({
      connectionString: conn,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const res = await client.query(sql);
    await client.end();

    console.log('Backfill complete. Inserted missing students if any.');
  } catch (err) {
    console.error('Failed to backfill students:', err.message);
    process.exit(1);
  }
})();
