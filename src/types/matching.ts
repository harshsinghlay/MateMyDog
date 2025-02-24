export interface MatchingFilters {
  breed: string;
  gender: string;
  ageRange: [number, number];
  distance: number;
  healthChecked: boolean;
  vaccinated: boolean;
  size?: PetSize;
  temperament?: string[];
  purpose: MatchingPurpose;
  availability: AvailabilityStatus;
}

export type PetSize = 'small' | 'medium' | 'large';

export type MatchingPurpose = 'breeding' | 'playdate' | 'adoption';

export type AvailabilityStatus = 'available' | 'pending' | 'matched';

export interface MatchResult {
  id: string;
  petId: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  imageUrl: string;
  distance: number;
  matchScore: number;
  verified: boolean;
  size: PetSize;
  temperament: string[];
  healthChecked: boolean;
  vaccinated: boolean;
  lastActive: string;
  ownerName: string;
  ownerImageUrl: string;
  purpose: MatchingPurpose;
  availability: AvailabilityStatus;
}