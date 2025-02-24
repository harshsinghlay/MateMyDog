import { useState, useEffect } from 'react';
import type { UserStats } from '../types/user';

export function useUserStats(userId: string) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock stats data
        const mockStats: UserStats = {
          totalPets: 2,
          totalMatches: 15,
          successfulBreedings: 8,
          reviewsGiven: 24,
          reviewsReceived: 45,
          averageRating: 4.8
        };

        setStats(mockStats);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user stats'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
}