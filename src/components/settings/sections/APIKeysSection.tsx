import { formatDistanceToNow } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useApiKeys, type ApiKey } from '../../../hooks/useApiKeys';
import { useAuth } from '../../../hooks/useAuth';
import { Icons } from '../../icons';

export function APIKeysSection() {
  const { user } = useAuth();
  const { loading, error, getApiKeys, createApiKey, deleteApiKey } = useApiKeys(user);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadApiKeys = useCallback(async () => {
    try {
      if (!user?.id) return;
      const keys = await getApiKeys(user.id);
      setApiKeys(keys || []);
    } catch (err) {
      console.error('Error loading API keys:', err);
    }
  }, [user, getApiKeys, setApiKeys]);

  useEffect(() => {
    if (user?.id) {
      loadApiKeys();
    }
  }, [user, loadApiKeys]);

  const handleCreateKey = async () => {
    if (!user?.id || !newKeyName.trim()) return;

    setIsCreating(true);
    setActionError(null);

    try {
      await createApiKey(user.id, newKeyName.trim());
      await loadApiKeys();
      setShowCreateModal(false);
      setNewKeyName('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteApiKey(id);
      await loadApiKeys();
    } catch (err) {
      console.error('Error deleting API key:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">API keys</h2>
          <p className="mt-1 text-sm text-gray-400">
            View and manage API keys for your organization
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex min-w-[160px] items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 active:bg-blue-700 sm:min-w-0 sm:py-2"
        >
          <Icons.Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create new secret key</span>
          <span className="sm:hidden">New Key</span>
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-400">
        <p>
          As an owner of this organization, you can view and manage all API keys in this
          organization.
        </p>
        <p>
          Do not share your API key with others or expose it in the browser or other client-side
          code. To protect your account's security, Fraqt AI may automatically disable any API key
          that has leaked publicly.
        </p>
      </div>

      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left">
              <tr className="border-b border-gray-800 text-left">
                <th className="pb-3 text-sm font-medium text-gray-400">Name</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Secret key</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Created</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Last used</th>
                <th className="pb-3 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    <Icons.Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    Loading API keys...
                  </td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No API keys found. Create one to get started.
                  </td>
                </tr>
              ) : (
                apiKeys.map((key) => (
                  <tr key={key.id} className="border-b border-gray-800">
                    <td className="py-4 text-white">{key.name}</td>
                    <td className="py-4 font-mono text-gray-400">{key.key_prefix}...</td>
                    <td className="py-4 text-gray-400">
                      {formatDistanceToNow(new Date(key.created_at), { addSuffix: true })}
                    </td>
                    <td className="py-4 text-gray-400">
                      {key.last_used_at
                        ? formatDistanceToNow(new Date(key.last_used_at), { addSuffix: true })
                        : 'Never'}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
                          <Icons.Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                          <Icons.Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-black">
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h3 className="text-lg font-medium text-white">Create API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Icons.X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {actionError && (
                <div className="flex items-center rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                  <Icons.AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                  {actionError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Key Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Production API Key"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full rounded-lg px-4 py-3 text-gray-300 transition-colors hover:text-white active:bg-gray-800 sm:w-auto sm:py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={isCreating || !newKeyName.trim()}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-white transition-colors hover:bg-blue-600 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
                >
                  {isCreating ? (
                    <>
                      <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Key'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
