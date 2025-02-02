import React from 'react';
import { Icons } from '../icons';

interface Change {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  type: 'feature' | 'improvement' | 'fix';
}

const recentChanges: Change[] = [
  {
    id: '1',
    title: 'Apple Wallet Integration',
    description: 'New API endpoints for managing certificates and pass signing',
    timeAgo: '13 hours ago',
    type: 'feature',
  },
  {
    id: '2',
    title: 'Analytics Engine 2.0',
    description: 'Enhanced real-time metrics and engagement tracking',
    timeAgo: '18 hours ago',
    type: 'improvement',
  },
  {
    id: '3',
    title: 'NFC Performance',
    description: 'Improved pass detection speed and reliability',
    timeAgo: '2 days ago',
    type: 'fix',
  },
];

export function LatestChanges() {
  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Latest Fraqt AI Changes</h3>
      </div>
      <div className="space-y-3">
        {recentChanges.map((change) => (
          <div key={change.id} className="relative pl-4">
            <div
              className={`absolute left-0 top-2 h-1.5 w-1.5 rounded-full ${
                change.type === 'feature'
                  ? 'bg-blue-500'
                  : change.type === 'improvement'
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
              }`}
            ></div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-white">{change.title}</p>
                <p className="text-[13px] text-gray-400">{change.timeAgo}</p>
              </div>
              <p className="mt-0.5 text-[12px] text-gray-500">{change.description}</p>
            </div>
          </div>
        ))}
        <button className="mt-2 inline-flex items-center text-[13px] text-gray-400 hover:text-white">
          View changelog →
        </button>
      </div>
    </div>
  );
}
