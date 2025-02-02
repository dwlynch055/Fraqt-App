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
    api: { rest: false, graphql: false, webhooks: false, rateLimiting: false }
  },
  notifications: {
    passActivations: false,
    customerEngagement: false,
    systemUpdates: false
  },
  security: {
    twoFactor: false,
    apiKeyRotation: false,
    sessionManagement: false
  }
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
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again later.';
      setError(errorMessage);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black rounded-xl w-full max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <p className="text-sm text-gray-400">
              {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
            </p>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-center">
                <Icons.AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-gray-900 border ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-colors`}
                  placeholder="you@example.com"
                />
                <Icons.Mail className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              </div>
              {validationErrors.email && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-gray-900 border ${
                    validationErrors.password ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-colors`}
                  placeholder={isSignUp ? 'Create a secure password' : 'Enter your password'}
                />
                <Icons.Lock className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              </div>
              {validationErrors.password && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <Icons.LogIn className="w-4 h-4 mr-2" />
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
            
            <p className="text-sm text-gray-400 text-center">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
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