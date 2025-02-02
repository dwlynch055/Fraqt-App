import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import type { PassWithTemplate } from 'types/database';
import { PassCreationWizard } from './PassCreationWizard';
import { useAuth } from '../../hooks/useAuth';
import { mockPasses } from '../../lib/mock-data';

export function PassList() {
  const [passes, setPasses] = useState<PassWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassWizard, setShowPassWizard] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Simulate API call
    const loadPasses = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        setPasses(mockPasses);
      } catch (error) {
        console.error('Error fetching passes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPasses();
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-lg bg-black p-6">
        <div className="flex items-center justify-center space-x-2">
          <Icons.Loader2 className="h-5 w-5 animate-spin text-white" />
          <p className="text-gray-400">Loading passes...</p>
        </div>
      </div>
    );
  }

  if (passes.length === 0) {
    return (
      <div className="rounded-lg bg-black p-6">
        <div className="text-center">
          <Icons.Ticket className="mx-auto mb-3 h-12 w-12 text-gray-600" />
          <p className="text-gray-400">No passes created yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-black">
      <div className="px-6 py-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Passes</h2>
          <button
            className="flex items-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-[0_0_1rem_0_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_1.5rem_0_rgba(0,0,0,0.3)]"
            onClick={() => setShowPassWizard(true)}
            disabled={!user}
          >
            <Icons.Plus className="mr-2 h-4 w-4" />
            <span className="font-medium">Create New Pass</span>
          </button>
        </div>
      </div>
      <div>
        {passes.map((pass) => (
          <div key={pass.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: pass.template.style.backgroundColor }}
                >
                  <Icons.Tag
                    className="h-6 w-6"
                    style={{ color: pass.template.style.foregroundColor }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{pass.template.name}</h3>
                  <p className="text-sm text-gray-400">{pass.template.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    pass.status === 'active'
                      ? 'bg-green-900 text-green-200'
                      : 'bg-gray-900 text-gray-200'
                  }`}
                >
                  {pass.status}
                </span>
                <button className="text-gray-500 hover:text-gray-300">
                  <Icons.MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showPassWizard && (
        <PassCreationWizard
          onClose={() => setShowPassWizard(false)}
          onComplete={async (templateData) => {
            // Handle pass creation
            setShowPassWizard(false);
          }}
        />
      )}
    </div>
  );
}
