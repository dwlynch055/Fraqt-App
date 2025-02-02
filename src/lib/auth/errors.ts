export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  EMAIL_NOT_CONFIRMED: 'Please check your email to confirm your account before signing in.',
  RATE_LIMIT_ERROR: 'Too many attempts. Please try again later.',
  NETWORK_ERROR: 'Connection failed. Please check your internet connection.',
  USER_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password is too weak. Please use a stronger password.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
} as const;

export function getAuthErrorMessage(error: any): string {
  if (!error) return AUTH_ERRORS.UNKNOWN;

  const message = error.message?.toLowerCase() || '';

  if (message.includes('invalid login credentials')) {
    return AUTH_ERRORS.INVALID_CREDENTIALS;
  }
  if (message.includes('email not confirmed')) {
    return AUTH_ERRORS.EMAIL_NOT_CONFIRMED;
  }
  if (message.includes('too many requests')) {
    return AUTH_ERRORS.RATE_LIMIT_ERROR;
  }
  if (message.includes('failed to fetch') || message.includes('network')) {
    return AUTH_ERRORS.NETWORK_ERROR;
  }
  if (message.includes('already registered')) {
    return AUTH_ERRORS.USER_EXISTS;
  }
  if (message.includes('password')) {
    return AUTH_ERRORS.WEAK_PASSWORD;
  }

  return error.message || AUTH_ERRORS.UNKNOWN;
}
