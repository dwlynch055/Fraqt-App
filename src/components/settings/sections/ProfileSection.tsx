import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { Icons } from '../../icons';

export function ProfileSection() {
  const { user } = useAuth();
  const { loading, error, updateProfile, getProfile } = useProfile(user);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (profile) {
          setName(profile.name || '');
          setPhone(profile.phone || '');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user, getProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      await updateProfile({ name, phone });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <p className="text-sm text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {saveError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-center">
            <Icons.AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {saveError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
          />
          <p className="mt-1 text-sm text-gray-500">
            The name associated with this account
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email address
          </label>
          <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-400">
            {user?.email}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            The email address associated with this account
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1234567890"
          />
          <p className="mt-1 text-sm text-gray-500">
            The phone number associated with this account
          </p>
        </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || isSaving}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
      </form>
    </div>
  );
}