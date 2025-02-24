import { useState, useEffect } from 'react';
import type { MatchingFilters, MatchResult } from '../types/matching';

export function useMatching(filters: MatchingFilters) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call with filters
        // For now, we'll simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in a real app this would come from the API
        const mockMatches: MatchResult[] = [
          {
            id: '1',
            petId: '1',
            name: 'Luna',
            breed: 'Golden Retriever',
            age: 2,
            gender: 'female',
            imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            distance: 3.2,
            matchScore: 95,
            verified: true,
            size: 'large',
            temperament: ['Friendly', 'Playful', 'Gentle'],
            healthChecked: true,
            vaccinated: true,
            lastActive: '2 hours ago',
            ownerName: 'Sarah Johnson',
            ownerImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
            purpose: 'breeding',
            availability: 'available'
          },
          {
            id: '2',
            petId: '2',
            name: 'Max',
            breed: 'German Shepherd',
            age: 3,
            gender: 'male',
            imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            distance: 5.7,
            matchScore: 88,
            verified: true,
            size: 'large',
            temperament: ['Intelligent', 'Protective', 'Active'],
            healthChecked: true,
            vaccinated: true,
            lastActive: '5 hours ago',
            ownerName: 'John Smith',
            ownerImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
            purpose: 'breeding',
            availability: 'available'
          }
        ];

        setMatches(mockMatches);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch matches'));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [filters]);

  return { matches, loading, error };
}