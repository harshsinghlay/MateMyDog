export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
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
