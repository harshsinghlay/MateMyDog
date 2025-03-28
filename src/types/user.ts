export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  isActive : boolean;
  location: {
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    lat? : string;
    lng?: string;
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
