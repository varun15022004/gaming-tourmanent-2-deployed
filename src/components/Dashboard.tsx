import { useAuth } from '../contexts/AuthContext';
import { Trophy, Star, TrendingUp, CreditCard as Edit } from 'lucide-react';
import { useState } from 'react';

export const Dashboard = () => {
  const { student, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState(student?.full_name || '');
  const [editCollegeId, setEditCollegeId] = useState(student?.college_id || '');
  const [gamePreferences, setGamePreferences] = useState(student?.game_preferences?.join(', ') || '');

  const handleSave = async () => {
    const games = gamePreferences.split(',').map(g => g.trim()).filter(Boolean);
    await updateProfile({
      full_name: editFullName,
      college_id: editCollegeId || undefined,
      game_preferences: games,
    });
    setIsEditing(false);
  };

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Student Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Profile</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit size={20} />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College ID</label>
                <input
                  type="text"
                  value={editCollegeId}
                  onChange={(e) => setEditCollegeId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game Preferences (comma separated)
                </label>
                <input
                  type="text"
                  value={gamePreferences}
                  onChange={(e) => setGamePreferences(e.target.value)}
                  placeholder="e.g., Valorant, League of Legends"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {student.full_name}</p>
              <p><span className="font-semibold">Email:</span> {student.email}</p>
              <p><span className="font-semibold">College ID:</span> {student.college_id || 'Not set'}</p>
              <p>
                <span className="font-semibold">Games:</span>{' '}
                {student.game_preferences?.length > 0 ? student.game_preferences.join(', ') : 'None selected'}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Trophy size={32} className="text-yellow-500 mb-2" />
          <h3 className="text-xl font-bold mb-2">Tournament Stats</h3>
          <div className="space-y-2">
            <p className="text-gray-600">Tournaments Entered: <span className="font-bold">0</span></p>
            <p className="text-gray-600">Wins: <span className="font-bold">0</span></p>
            <p className="text-gray-600">Win Rate: <span className="font-bold">0%</span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Star size={32} className="text-blue-500 mb-2" />
          <h3 className="text-xl font-bold mb-2">Ranking</h3>
          <div className="space-y-2">
            <p className="text-gray-600">Global Rank: <span className="font-bold">#-</span></p>
            <p className="text-gray-600">College Rank: <span className="font-bold">#-</span></p>
            <p className="text-gray-600">Points: <span className="font-bold">0</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <TrendingUp size={24} className="text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Recent Activity</h3>
        </div>
        <p className="text-gray-600">No recent activity. Register for a tournament to get started!</p>
      </div>
    </div>
  );
};
