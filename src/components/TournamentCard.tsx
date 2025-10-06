import { Calendar, Users, Trophy } from 'lucide-react';

interface Tournament {
  id: string;
  title: string;
  game: string;
  date: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  status: 'upcoming' | 'live' | 'completed';
}

interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    live: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-white text-2xl font-bold mb-2">{tournament.game}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[tournament.status]}`}>
            {tournament.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-xl font-bold mb-4">{tournament.title}</h4>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-2" />
            <span>{tournament.date}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Users size={18} className="mr-2" />
            <span>{tournament.participants} / {tournament.maxParticipants} Participants</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Trophy size={18} className="mr-2 text-yellow-500" />
            <span className="font-semibold">{tournament.prize}</span>
          </div>
        </div>

        <button
          disabled={tournament.status === 'completed' || tournament.participants >= tournament.maxParticipants}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {tournament.status === 'completed' ? 'Completed' :
           tournament.participants >= tournament.maxParticipants ? 'Full' : 'Register'}
        </button>
      </div>
    </div>
  );
};
