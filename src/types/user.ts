export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  isActive: boolean;
  location: Address | null;
}

export interface Address {
  id?: string,
  postalCode?: string,
  state?: string,
  city?: string,
  country?: string,
  lat?: string,
  lng?: string,
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  matchingAlerts: boolean;
  privateProfile: boolean;
  language: string;
  timezone: string;
}

export interface UserStats {
  totalPets: number;
  totalMatches: number;
  successfulBreedings: number;
  reviewsGiven: number;
  reviewsReceived: number;
  averageRating: number;
}
