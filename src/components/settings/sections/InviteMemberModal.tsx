import React, { useState } from 'react';
import { Icons } from '../../icons';
import { validateEmail } from '../../../lib/validation';
import { useDatabase } from '../../../hooks/useDatabase';

interface InviteMemberModalProps {
  onClose: () => void;
  onInvite: (email: string, role: string) => Promise<void>;
}

export function InviteMemberModal({ onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      await onInvite(email, role);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-black">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <h3 className="text-lg font-medium text-white">Invite Team Member</h3>
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
                className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="colleague@company.com"
              />
              <Icons.Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {role === 'admin' && 'Can manage team members and all settings'}
              {role === 'member' && 'Can manage passes and view analytics'}
              {role === 'viewer' && 'Can view passes and analytics'}
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {isLoading ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icons.Send className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
