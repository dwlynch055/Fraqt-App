import React, { useState } from 'react';
import { Icons } from '../../icons'; 
import { Check } from 'lucide-react';

export function SalesforceIntegration() {
  const [instanceUrl, setInstanceUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnecting(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Salesforce Instance URL
          </label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={instanceUrl}
              onChange={(e) => setInstanceUrl(e.target.value)}
              placeholder="your-instance.salesforce.com"
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleConnect}
              disabled={!instanceUrl || isConnecting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isConnecting ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-3">Features</h4>
          <ul className="space-y-2">
            {[
              'Customer data synchronization',
              'Automated pass lifecycle management',
              'Real-time status updates',
              'Custom field mapping',
              'Advanced segmentation'
            ].map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 mr-2 text-blue-400" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}