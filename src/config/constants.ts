export const APP_CONFIG = {
    // Default to localhost for development
    baseUrl: 'http://localhost:5173',
    
    // Social routes
    routes: {
      socialPost: (id: string) => `/socialPost/${id}`,
      petProfile: (id: string) => `/pets/${id}`,
    }
  } as const;