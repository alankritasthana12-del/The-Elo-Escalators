import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Inbox } from 'lucide-react';
import api from '../../services/api';
import MatchCard from '../../components/cards/MatchCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.getMatches();
      setMatches(response.matches || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-text">AI Matches</h1>
        </div>
        <p className="text-sm text-text-secondary max-w-lg">
          These are possible matches our AI found between lost and found reports. Review the confidence scores and match reasons, then claim your item.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {error && (
        <ErrorState
          title="Couldn't load matches"
          description="We had trouble loading AI matches. Please try again."
          onRetry={fetchMatches}
        />
      )}

      {!loading && !error && matches.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No matches yet"
          description="When our AI finds possible matches between lost and found items, they'll appear here."
        />
      )}

      {!loading && !error && matches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {matches.map((match, index) => (
            <MatchCard key={match.id} match={match} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
