import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchingHero } from '../components/matching/MatchingHero';
import { MatchingFilters } from '../components/matching/MatchingFilters';
import { MatchingResults } from '../components/matching/MatchingResults';
import { useMatching } from '../hooks/useMatching';
import type { MatchingFilters as FilterType } from '../types/matching';

export function PetMatching() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterType>({
    breed: '',
    gender: '',
    ageRange: [0, 15],
    distance: 50,
    healthChecked: false,
    vaccinated: false,
    temperament: [],
    purpose: 'breeding',
    availability: 'available'
  });

  const { matches, loading, error } = useMatching(filters);

  const handleLike = (matchId: string) => {
    // In a real app, this would call an API
    console.log('Liked match:', matchId);
  };

  const handleMessage = (matchId: string) => {
    // In a real app, this would open a chat or messaging interface
    console.log('Messaging match:', matchId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MatchingHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-3">
            <MatchingFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </aside>
          
          <main className="mt-6 lg:mt-0 lg:col-span-9">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Finding perfect matches...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                {error.message}
              </div>
            ) : (
              <MatchingResults
                matches={matches}
                onLike={handleLike}
                onMessage={handleMessage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}