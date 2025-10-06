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
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  games text[] := '{}';
begin
  begin
    games := coalesce(
      array(select jsonb_array_elements_text(new.raw_user_meta_data->'game_preferences')),
      '{}'::text[]
    );
  exception when others then
    games := '{}'::text[];
  end;

  insert into public.students (user_id, email, full_name, college_id, game_preferences)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'full_name')::text, new.email),
    (new.raw_user_meta_data->>'college_id')::text,
    games
  )
  on conflict (user_id) do update
    set game_preferences = coalesce(excluded.game_preferences, public.students.game_preferences);

  return new;
end;
$$;
`;

    const client = new Client({
      connectionString: conn,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    await client.query(sql);
    await client.end();

    console.log('Updated handle_new_user trigger to include game_preferences.');
  } catch (err) {
    console.error('Failed to update trigger:', err.message);
    process.exit(1);
  }
})();
