import { useState, useEffect } from 'react';
import type { MatchingFilters, MatchResult } from '../types/matching';
import { calculateDistance } from '../utils/locationHelpers';
import { petService } from '../lib/supabase/services';
import { matchingService } from '../lib/supabase/services/matchingService';

export function useMatching(filters: MatchingFilters) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const fetchMatches = async () => {
      if (!filters.selectedPetId) {
        setMatches([]);
        return
      };

      try {
        setLoading(true);
        setError(null);

        // Get the selected pet's details first
        const selectedPet = await petService.getPet(filters.selectedPetId)

        if (!selectedPet) throw new Error('Selected pet not found');

        const matches = await matchingService.getMatches(filters);

        // Process and filter matches
        const processedMatches = await Promise.all(
          matches?.map(async (matchdata) => {
            const match = await petService.fromDbFormat(matchdata);
            if (!match.owner?.location) return null;

            const distance = calculateDistance(
              selectedPet.owner.location.lat,
              selectedPet.owner.location.lng,
              match.owner.location.lat,
              match.owner.location.lng
            );

            // skip according to healthchecked
            if (filters.healthChecked) {
              if (match.medicalHistory.length === 0) return null;
            }

            // skip according to healthchecked
            if (filters.vaccinated) {
              if (match.vaccinations.length === 0) return null;
            }

            // Skip if beyond distance filter
            if (distance > filters.distance) return null;


            // Calculate match score based on various factors
            let matchScore = 0;

            // 1. Breed match (30 points if exact match, 15 points if same breed group)
            if (filters.breed) {
              if (match.breed === filters.breed) {
                matchScore += 30; // Exact breed match
              } 
            }

            // 2. Temperament match (10 points per matching temperament, max 40 points)
            if (filters.temperament?.length) {
              const commonTemperaments = match.temperament.filter(t =>
                filters.temperament?.includes(t)
              ).length;
              matchScore += Math.min(commonTemperaments * 10, 40); // Cap at 40 points
            }


            // 4. Distance proximity (20 points if within 10km, 10 points if within 25km)
            if (distance <= 10) {
              matchScore += 20;
            } else if (distance <= 25) {
              matchScore += 10;
            }

            // 5. Health status (10 points if health checked, 10 points if vaccinated)
            if (match.medicalHistory.length > 0) {
              matchScore += 10;
            }
            if (match.vaccinations.length > 0) {
              matchScore += 10;
            }
          
            // Ensure score doesn't exceed 100
            matchScore = Math.min(matchScore, 100);

            return {
              ...match,
              healthChecked: match.medicalHistory.length > 0,
              vaccinated: match.vaccinations.length > 0,
              distance,
              matchScore,
              lastActive: new Date().toISOString(),
              availability: 'available' as const,
            } as MatchResult;
          }) || []
        );

        setMatches(processedMatches.filter(Boolean) as MatchResult[]);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch matches'));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [filters , filters.selectedPetId]);

  return { matches, loading, error };
}