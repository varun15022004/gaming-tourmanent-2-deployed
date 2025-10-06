import { Trophy, Users, Calendar } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
}

export const Hero = ({ onJoinClick }: HeroProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Join the Ultimate Gaming Tournament Experience
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Compete with elite gamers, climb the leaderboards, and win amazing prizes in our
            professional esports tournaments.
          </p>
          <button
            onClick={onJoinClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105"
          >
            Register Now
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <Trophy size={48} className="mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-bold mb-2">Professional Tournaments</h3>
              <p className="text-gray-300">
                Compete in organized tournaments with cash prizes and glory
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <Users size={48} className="mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-bold mb-2">Growing Community</h3>
              <p className="text-gray-300">
                Join thousands of passionate gamers from colleges nationwide
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <Calendar size={48} className="mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold mb-2">Weekly Events</h3>
              <p className="text-gray-300">
                New tournaments and challenges every week to keep you engaged
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
