import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // set in Netlify
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // set in Netlify

function getAdminClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE URL or SERVICE ROLE KEY');
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

function toCsv(rows) {
  const cols = ['full_name','email','college_id','game_preferences','created_at'];
  const header = cols.join(',');
  const escape = (v) => {
    if (v == null) return '';
    const s = Array.isArray(v) ? v.join('|') : String(v);
    const needs = /[",\n]/.test(s);
    return needs ? '"' + s.replace(/"/g,'""') + '"' : s;
  };
  const lines = rows.map(r => cols.map(c => escape(r[c])).join(','));
  return [header, ...lines].join('\n');
}

exports.handler = async (event) => {
  try {
    const secret = event.headers['x-admin-secret'] || event.queryStringParameters?.secret;
    if (!ADMIN_PASSWORD || secret !== ADMIN_PASSWORD) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('students')
      .select('full_name,email,college_id,game_preferences,created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const csv = toCsv(data || []);
    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/csv',
        'content-disposition': 'attachment; filename="students.csv"'
      },
      body: csv,
    };
  } catch (e) {
    return { statusCode: 500, body: e.message || 'Server error' };
  }
};
