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

    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node scripts/promote_admin.js <admin_email>');
      process.exit(1);
    }

    const sql = `
update public.students s
set is_admin = true
where s.user_id in (
  select u.id from auth.users u where lower(u.email) = lower($1)
);
`;

    const client = new Client({
      connectionString: conn,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const res = await client.query(sql, [email]);
    await client.end();

    console.log(`Promoted admin for email: ${email}`);
  } catch (err) {
    console.error('Failed to promote admin:', err.message);
    process.exit(1);
  }
})();
