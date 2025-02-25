export const APP_CONFIG = {
  baseUrl: window.location.origin,
  // Social routes
  routes: {
    socialPost: (id: string) => `/socialPost/${id}`,
    petProfile: (id: string) => `/pets/${id}`,
  },
} as const;
