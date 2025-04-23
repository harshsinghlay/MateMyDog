import { Pet } from "./pet";

export type MatchingAvailability = 'available' | 'pending' | 'matched';

export interface MatchingFilters {
  selectedPetId?: string;
  breed?: string;
  gender?: 'male' | 'female' | '';
  ageRange: {min : string, max : string};
  distance: number;
  healthChecked: boolean;
  vaccinated: boolean;
  temperament?: string[];
  purpose: MatchingPurpose;
  availability: MatchingAvailability;
}


export type MatchingPurpose = 'breeding' | 'playdate' | 'adoption';

export type AvailabilityStatus = 'available' | 'pending' | 'matched';

interface MatchCriteria {
  distance: number;
  matchScore: number;
  lastActive: string;
  availability: MatchingAvailability;
}

export interface MatchResult extends Pet, MatchCriteria {}