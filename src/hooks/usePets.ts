import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { petService } from '../lib/supabase/services';
import type { Pet } from '../types/pet';

export function usePets() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPets = async () => {
    if (!user?.id) {
      setPets([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userPets = await petService.getUserPets(user.id);
      setPets(userPets || []);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch pets'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user?.id]);

  return {
    pets,
    loading,
    error,
    refetch: fetchPets
  };
}