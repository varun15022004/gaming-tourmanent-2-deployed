import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        if (!fullName.trim()) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        if (selectedGames.length < 1) {
          setError('Please select at least one game');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName, collegeId, selectedGames);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="collegeId" className="block text-sm font-medium text-gray-700 mb-1">
                  College ID (Optional)
                </label>
                <input
                  id="collegeId"
                  type="text"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">Select your games (choose any)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    'PUBG Mobile',
                    'Call of Duty Mobile',
                    'Free Fire',
                  ].map((game) => {
                    const active = selectedGames.includes(game);
                    return (
                      <button
                        key={game}
                        type="button"
                        onClick={() => {
                          setSelectedGames((prev) =>
                            prev.includes(game)
                              ? prev.filter((g) => g !== game)
                              : [...prev, game]
                          );
                        }}
                        className={
                          `w-full px-4 py-3 rounded-lg border text-sm font-medium transition ` +
                          (active
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white hover:bg-gray-50')
                        }
                        aria-pressed={active}
                      >
                        {game}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">You can register for all, any two, or any one.</p>
              </div>
            </>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

      </div>
    </div>
  );
};
