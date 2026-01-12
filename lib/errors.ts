/**
 * Error Handling Utilities - Better-Auth Integration
 *
 * Tasks implemented: T089-T091
 * - T089: Error normalization utility functions
 * - T090: AuthErrorMessages constants
 * - T091: TodoErrorMessages constants
 */

// T090: Define AuthErrorMessages constants
export const AuthErrorMessages = {
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  EMAIL_ALREADY_EXISTS: "This email is already registered. Please log in instead.",
  NOT_AUTHENTICATED: "Authentication required. Please log in.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  NETWORK_ERROR: "Network error occurred. Please check your connection and try again.",
  SERVER_ERROR: "Service temporarily unavailable. Please try again later.",
  PASSWORD_REQUIREMENTS: "Password must be at least 8 characters with uppercase letter and digit.",
  INVALID_EMAIL_FORMAT: "Please enter a valid email address.",
} as const;

// T091: Define TodoErrorMessages constants
export const TodoErrorMessages = {
  NOT_FOUND: "Todo not found.",
  FORBIDDEN: "Access denied. You don't have permission to perform this action.",
  INVALID_DATA: "Invalid data provided. Please check your input and try again.",
  SERVER_ERROR: "Failed to process your request. Please try again later.",
} as const;

// T089: Error normalization utility functions
export function normalizeAuthError(error: unknown): string {
  if (!error) {
    return AuthErrorMessages.SERVER_ERROR;
  }

  // Handle specific error codes/statuses
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    const statusCode = errorObj.status || errorObj.statusCode || errorObj.code;

    // Network errors
    if (errorObj.type === 'network_error' || errorObj.name === 'TypeError') {
      return AuthErrorMessages.NETWORK_ERROR;
    }

    // Authentication-specific errors
    switch (statusCode) {
      case 400:
        if (errorObj.message?.includes('already exists')) {
          return AuthErrorMessages.EMAIL_ALREADY_EXISTS;
        }
        return AuthErrorMessages.INVALID_CREDENTIALS;

      case 401:
      case 403:
        return AuthErrorMessages.NOT_AUTHENTICATED;

      case 422:
        return AuthErrorMessages.INVALID_EMAIL_FORMAT;

      case 500:
      case 503:
        return AuthErrorMessages.SERVER_ERROR;

      default:
        // Check for specific error messages
        if (errorObj.message) {
          const message = errorObj.message.toLowerCase();

          if (message.includes('email') && message.includes('already') && message.includes('exists')) {
            return AuthErrorMessages.EMAIL_ALREADY_EXISTS;
          }

          if (message.includes('invalid') || message.includes('credential')) {
            return AuthErrorMessages.INVALID_CREDENTIALS;
          }
        }
        return AuthErrorMessages.SERVER_ERROR;
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    const lowerError = error.toLowerCase();

    if (lowerError.includes('already exists')) {
      return AuthErrorMessages.EMAIL_ALREADY_EXISTS;
    }

    if (lowerError.includes('invalid') || lowerError.includes('credential')) {
      return AuthErrorMessages.INVALID_CREDENTIALS;
    }
  }

  // Fallback
  return AuthErrorMessages.SERVER_ERROR;
}

export function normalizeTodoError(error: unknown): string {
  if (!error) {
    return TodoErrorMessages.SERVER_ERROR;
  }

  // Handle specific error codes/statuses
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    const statusCode = errorObj.status || errorObj.statusCode || errorObj.code;

    switch (statusCode) {
      case 401:
      case 403:
        return TodoErrorMessages.FORBIDDEN;

      case 404:
        return TodoErrorMessages.NOT_FOUND;

      case 422:
        return TodoErrorMessages.INVALID_DATA;

      case 500:
      case 503:
        return TodoErrorMessages.SERVER_ERROR;

      default:
        // Check for specific error messages
        if (errorObj.message) {
          const message = errorObj.message.toLowerCase();

          if (message.includes('not found')) {
            return TodoErrorMessages.NOT_FOUND;
          }

          if (message.includes('forbidden') || message.includes('permission')) {
            return TodoErrorMessages.FORBIDDEN;
          }
        }
        return TodoErrorMessages.SERVER_ERROR;
    }
  }

  // Fallback
  return TodoErrorMessages.SERVER_ERROR;
}

// Generic error normalization
export function normalizeError(error: unknown, context: 'auth' | 'todo' | 'general' = 'general'): string {
  switch (context) {
    case 'auth':
      return normalizeAuthError(error);
    case 'todo':
      return normalizeTodoError(error);
    default:
      // For general errors, return a generic message
      return (error as any)?.message || 'An unexpected error occurred. Please try again.';
  }
}