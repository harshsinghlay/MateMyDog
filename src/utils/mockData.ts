import type { Pet } from '../types/pet';

export const mockPetData: Pet = {
  id: '1',
  name: 'Luna',
  breed: 'Golden Retriever',
  age: 2,
  gender: 'female',
  imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ownerId: 'user1',
  ownerName: 'Sarah Johnson',
  dateOfBirth: '2022-01-15',
  weight: 25,
  microchipId: 'CHIP123456',
  location: {
    address: '123 Pet Street',
    city: 'San Francisco',
    state: 'California',
    country: 'USA',
    postalCode: '94105'
  },
  medicalHistory: [
    {
      id: '1',
      date: '2024-02-15',
      condition: 'Annual Check-up',
      treatment: 'General examination and vaccinations',
      veterinarian: 'Dr. Smith'
    }
  ],
  vaccinations: [
    {
      id: '1',
      name: 'Rabies',
      date: '2024-02-15',
      nextDueDate: '2025-02-15',
      administrator: 'Dr. Smith'
    }
  ],
  media: [
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Playing in the park',
      timestamp: '2024-03-15T10:30:00Z'
    }
  ],
  likes: [
    {
      id: '1',
      userId: 'user2',
      userName: 'John Doe',
      timestamp: '2024-03-15T10:30:00Z'
    }
  ],
  reviews: [
    {
      id: '1',
      userId: 'user2',
      userName: 'John Doe',
      rating: 5,
      comment: 'Such a friendly dog!',
      timestamp: '2024-03-15T10:30:00Z',
      likes: 2
    }
  ],
  comments: [
    {
      id: '1',
      userId: 'user2',
      userName: 'John Doe',
      content: 'Beautiful dog!',
      timestamp: '2024-03-15T10:30:00Z',
      likes: 1
    }
  ],
  rating: 5
};