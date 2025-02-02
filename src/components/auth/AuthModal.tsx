import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Icons } from '../icons';
import { validateEmail, validatePassword } from '../../lib/validation';
import { useDatabase } from '../../hooks/useDatabase';
import type { Merchant } from '../../types/database';
import { Logo } from '../icons/Logo';

const defaultSettings: Merchant['settings'] = {
  integrations: {
    pos: { square: false, shopify: false, lightspeed: false, toast: false, clover: false },
    ecommerce: { shopify: false, woocommerce: false, magento: false, bigcommerce: false },
    crm: { salesforce: false, hubspot: false, zoho: false, dynamics: false },
    loyalty: { custom: false, loyaltylion: false, yotpo: false, points: false },
    mobile: { ios: false, android: false, reactNative: false, flutter: false },
    inventory: { custom: false, tradegecko: false, cin7: false, brightpearl: false },
    api: { rest: false, graphql: false, webhooks: false, rateLimiting: false },
  },
  notifications: {
    passActivations: false,
    customerEngagement: false,
    systemUpdates: false,
  },
  security: {
    twoFactor: false,
    apiKeyRotation: false,
    sessionManagement: false,
  },
};

interface AuthModalProps {
  onClose: () => void;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const { signIn, signUp } = useAuth();
  const { createMerchant } = useDatabase();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors: ValidationErrors = {};

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const validationResult = validateForm();
    if (!validationResult) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(trimmedEmail, trimmedPassword);
        setError('Account created successfully! Please check your email to verify your account.');
        setIsSignUp(false);
      } else {
        await signIn(trimmedEmail, trimmedPassword);
        onClose();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again later.';
      setError(errorMessage);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative">
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
            <p className="text-sm text-gray-400">
              {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
            </p>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
              <Icons.X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {error && (
              <div className="flex items-center rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                <Icons.AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border bg-gray-900 ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg py-2 pl-10 pr-4 text-white transition-colors focus:ring-2 focus:ring-indigo-500`}
                  placeholder="you@example.com"
                />
                <Icons.Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border bg-gray-900 ${
                    validationErrors.password ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg py-2 pl-10 pr-4 text-white transition-colors focus:ring-2 focus:ring-indigo-500`}
                  placeholder={isSignUp ? 'Create a secure password' : 'Enter your password'}
                />
                <Icons.Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-white transition-colors hover:bg-blue-600 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <Icons.LogIn className="mr-2 h-4 w-4" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-green-400 transition-colors hover:text-green-300"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
