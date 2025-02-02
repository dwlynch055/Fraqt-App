import React, { useState } from 'react';
import { Icons } from '../../icons';
import { Check } from 'lucide-react';

export function SalesforceIntegration() {
  const [instanceUrl, setInstanceUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsConnecting(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Salesforce Instance URL
          </label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={instanceUrl}
              onChange={(e) => setInstanceUrl(e.target.value)}
              placeholder="your-instance.salesforce.com"
              className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleConnect}
              disabled={!instanceUrl || isConnecting}
              className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-gray-900 p-4">
          <h4 className="mb-3 text-sm font-medium text-white">Features</h4>
          <ul className="space-y-2">
            {[
              'Customer data synchronization',
              'Automated pass lifecycle management',
              'Real-time status updates',
              'Custom field mapping',
              'Advanced segmentation',
            ].map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-gray-400">
                <Check className="mr-2 h-4 w-4 text-blue-400" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
