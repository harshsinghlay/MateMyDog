import { MatchCard } from './MatchCard';
import type { MatchResult } from '../../types/matching';
import { MatchingSkeleton } from './MatchingSkeleton.jsx'

interface MatchingResultsProps {
  matches: MatchResult[];
  onMessage: (userId: string) => void;
  loading: boolean
}

export function MatchingResults({ matches , onMessage, loading }: MatchingResultsProps) {
  if (loading) {
    return <MatchingSkeleton />;
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No matches found with current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onMessage={() => onMessage(match.owner.id)}
        />
      ))}
    </div>
  );
}
