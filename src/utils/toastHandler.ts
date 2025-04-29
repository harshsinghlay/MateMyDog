import { toast } from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  icon?: string;
}

export const showToast = {
  error: (error: unknown, options?: ToastOptions) => {
    let message = 'An error occurred';

    if (error instanceof Error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        message = 'Network error. Please check your connection.';
      }
      // Handle other standard errors
      else {
        message = getErrorMessage(error);
      }
    }
    // Handle error responses from API
    else if (isErrorResponse(error)) {
      message = getErrorMessageFromStatus(error.status);
    }

    toast.error(message, {
      duration: options?.duration || 4000,
      icon: options?.icon || '❌',
    });
  },

  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 2000,
      icon: options?.icon || '✅',
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: options?.duration || 2000,
      icon: options?.icon || 'ℹ️',
    });
  },
};

function isErrorResponse(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function getErrorMessageFromStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Please sign in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This action conflicts with existing data.';
    case 422:
      return 'Invalid input data provided.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'Service temporarily unavailable. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return status >= 500
        ? 'Internal server error. Please try again later.'
        : 'An error occurred. Please try again.';
  }
}

function getErrorMessage(error: Error): string {
  // Handle specific error types
  if (error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your connection.';
  }
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  if (error.message.includes('NetworkError')) {
    return 'Network error. Please check your connection.';
  }
  
  // Return a generic message for other errors
  return 'An unexpected error occurred. Please try again.';
}