import { Gamepad2, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
}

export const Header = ({ onAuthClick }: HeaderProps) => {
  const { user, student, signOut } = useAuth();

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gamepad2 size={32} className="text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold">GameArena College</h1>
            <p className="text-sm text-gray-300">Elite Gaming Tournament Hub</p>
          </div>
        </div>

        <nav className="flex items-center space-x-6">

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg">
                <User size={18} />
                <span className="text-sm">{student?.full_name || user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition font-medium"
            >
              Register
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
