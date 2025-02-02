import React, { useState, useEffect } from 'react';
import { Icons } from '../../icons';
import { useAuth } from '../../../hooks/useAuth';
import { useApiKeys, type ApiKey } from '../../../hooks/useApiKeys';
import { formatDistanceToNow } from 'date-fns';

export function APIKeysSection() {
  const { user } = useAuth();
  const { loading, error, getApiKeys, createApiKey, deleteApiKey } = useApiKeys(user);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadApiKeys();
    }
  }, [user]);

  const loadApiKeys = async () => {
    try {
      if (!user?.id) return;
      const keys = await getApiKeys(user.id);
      setApiKeys(keys || []);
    } catch (err) {
      console.error('Error loading API keys:', err);
    }
  };

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
          <p className="text-sm text-gray-400 mt-1">
            View and manage API keys for your organization
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors sm:py-2 min-w-[160px] sm:min-w-0"
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Create new secret key</span>
          <span className="sm:hidden">New Key</span>
        </button>
      </div>

      <div className="text-sm text-gray-400 space-y-2">
        <p>
          As an owner of this organization, you can view and manage all API keys in this organization.
        </p>
        <p>
          Do not share your API key with others or expose it in the browser or other client-side code. To protect your account's security, Fraqt AI may automatically disable any API key that has leaked publicly.
        </p>
      </div>

      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left">
              <tr className="text-left border-b border-gray-800">
                <th className="pb-3 text-sm font-medium text-gray-400">Name</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Secret key</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Created</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Last used</th>
                <th className="pb-3 text-sm font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    <Icons.Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
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
                <tr key={key.key} className="border-b border-gray-800">
                  <td className="py-4 text-white">{key.name}</td>
                  <td className="py-4 font-mono text-gray-400">{key.key_prefix}...</td>
                  <td className="py-4 text-gray-400">{formatDistanceToNow(new Date(key.created_at), { addSuffix: true })}</td>
                  <td className="py-4 text-gray-400">
                    {key.last_used_at 
                      ? formatDistanceToNow(new Date(key.last_used_at), { addSuffix: true })
                      : 'Never'}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                        <Icons.Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteKey(key.id)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                      >
                        <Icons.Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-xl w-full max-w-md border border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="text-lg font-medium text-white">Create API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {actionError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-center">
                  <Icons.AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {actionError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Production API Key"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-300 hover:text-white active:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={isCreating || !newKeyName.trim()}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-3 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
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