import React, { useState } from "react";
import { MatchingHero } from "../components/matching/MatchingHero";
import { MatchingFilters } from "../components/matching/MatchingFilters";
import { MatchingResults } from "../components/matching/MatchingResults";
import { useMatching } from "../hooks/useMatching";
import type { MatchingFilters as FilterType } from "../types/matching";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export function PetMatching() {
    const [filters, setFilters] = useState<FilterType>({
      selectedPetId: undefined,
      breed: '',
      gender: '',
      ageRange: {min : "", max : ""},
      distance: 50,
      healthChecked: false,
      vaccinated: false,
      temperament: [],
      purpose: 'breeding',
      availability: 'available',
    });

  const { matches, loading, error } = useMatching(filters);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();


  const handleMessage = (userId : string) => {
    if (!isAuthenticated) {
      toast("Please sign in to send messages", { icon: "🔒" });
      return;
    }
    navigate('/chats', { state: { userId } });
  };


  return (
    <div className=" bg-gray-50 pb-16 md:pb-0">
      <MatchingHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-3">
            <MatchingFilters filters={filters} onFilterChange={setFilters} />
          </aside>

          <main className="mt-6 lg:mt-0 lg:col-span-9">
              <MatchingResults
                matches={matches}
                onMessage={handleMessage}
                loading={loading}
              />
          </main>
        </div>
      </div>
    </div>
  );
}
