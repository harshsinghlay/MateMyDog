import { useState, useEffect } from 'react';
import type { User } from '../types/user';

export function useUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock current user ID - in a real app, this would come from auth context
  const currentUserId = 'user1';
  const isCurrentUser = userId === currentUserId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock user data
        const mockUser: User = {
          id: userId || 'user1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          bio: 'Pet lover and proud owner of two amazing dogs. Passionate about animal welfare and breeding ethics.',
          location: {
            city: 'San Francisco',
            state: 'California',
            country: 'USA'
          },
          joinedDate: '2023-01-15',
          pets: ['pet1', 'pet2'],
          following: 128,
          followers: 256,
          reviews: 45,
          rating: 4.8,
          verified: true
        };

        setUser(mockUser);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error, isCurrentUser };
}