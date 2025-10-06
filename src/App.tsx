import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';


function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />

      {user && showDashboard ? (
        <Dashboard />
      ) : (
        <>
          <Hero onJoinClick={() => user ? setShowDashboard(true) : setIsAuthModalOpen(true)} />



        </>
      )}

      {showDashboard && user && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setShowDashboard(false)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
          >
            Back to Home
          </button>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
