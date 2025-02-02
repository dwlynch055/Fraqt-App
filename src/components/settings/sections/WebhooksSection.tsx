import React, { useState } from 'react';
import { Icons } from '../../icons';

interface Webhook {
  id: string;
  url: string;
  protocol: string;
  events: string[];
  active: boolean;
}

export function WebhooksSection() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Webhooks</h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage real-time notifications for pass events
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          <Icons.Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </button>
      </div>

      <div className="rounded-lg bg-blue-500/10 p-4">
        <div className="flex items-start space-x-3">
          <Icons.AlertCircle className="mt-0.5 h-5 w-5 text-blue-400" />
          <div className="space-y-1">
            <p className="text-sm text-blue-300">
              Webhooks can send you real-time notifications of changes to your passes. For example,
              you can receive real-time updates whenever a pass is issued, updated, added to a new
              device, or removed from a device.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-black">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Protocol</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">URL</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8">
                    <div className="text-center">
                      <Icons.Webhook className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                      <p className="text-gray-400">No webhooks configured</p>
                    </div>
                  </td>
                </tr>
              ) : (
                webhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <td className="px-4 py-4 text-white">{webhook.id}</td>
                    <td className="px-4 py-4 text-gray-400">{webhook.protocol}</td>
                    <td className="px-4 py-4 text-gray-400">{webhook.url}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
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

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-black">
            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-lg font-medium text-white">Add Webhook</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <Icons.X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Endpoint URL</label>
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://api.example.com/webhook"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Events</label>
                <div className="space-y-2">
                  {[
                    'Pass Created',
                    'Pass Updated',
                    'Pass Added to Device',
                    'Pass Removed from Device',
                  ].map((event) => (
                    <label key={event} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-800 bg-gray-900 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-300">{event}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                  Add Webhook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
