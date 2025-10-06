import { useEffect, useState } from 'react';
import { supabase, Student } from '../lib/supabase';

export const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
  const [rows, setRows] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminSecret, setAdminSecret] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try Netlify function first (service role, requires ADMIN_PASSWORD)
      const resp = await fetch('/.netlify/functions/admin-list', {
        headers: adminSecret ? { 'x-admin-secret': adminSecret } : {},
      });
      if (resp.ok) {
        const data = await resp.json();
        setRows(data || []);
        return;
      }
      // Fallback to direct Supabase (works only for signed-in admins)
      const { data, error } = await supabase
        .from('students')
        .select('id,user_id,email,full_name,college_id,game_preferences,created_at,updated_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin • Registered Users</h2>
        <div className="flex items-center gap-3">
          <input
            type="password"
            placeholder="Admin password"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray-300"
          />
          <button
            onClick={load}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Load
          </button>
          <button
            onClick={async () => {
              try {
                const resp = await fetch('/.netlify/functions/admin-export', {
                  headers: adminSecret ? { 'x-admin-secret': adminSecret } : {},
                });
                if (!resp.ok) throw new Error('Export failed');
                const text = await resp.text();
                const blob = new Blob([text], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'students.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (e: any) {
                setError(e.message || 'Export failed');
              }
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            Export CSV
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">College ID</th>
                <th className="px-4 py-3 text-left">Games</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.full_name}</td>
                  <td className="px-4 py-3 text-gray-700">{r.email}</td>
                  <td className="px-4 py-3 text-gray-600">{r.college_id || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{(r.game_preferences || []).join(', ') || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
