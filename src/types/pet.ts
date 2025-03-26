export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  dateOfBirth: string;
  weight: number;
  microchipId: string;
  temperament: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  medicalHistory: MedicalRecord[];
  vaccinations: Vaccination[];
  media: PetMedia[];
  likes: Like[];
  reviews: Review[];
  comments: Comment[];
  rating: number;
  matchmaking?: {
    enabled: boolean;
    purposes: string[];
  };
}

export interface MedicalRecord {
  id: string;
  date: string;
  condition: string;
  treatment: string;
  veterinarian: string;
  notes?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  administrator: string;
  batchNumber?: string;
  manufacturer?: string;
}

export interface PetMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  timestamp: string;
}

export interface Like {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
  likes: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}