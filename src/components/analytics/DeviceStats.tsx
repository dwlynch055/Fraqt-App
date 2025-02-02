import React from 'react';
import { Icons } from '../icons';

const mockData = [
  { platform: 'iOS', count: 6543, icon: Icons.Apple },
  { platform: 'Android', count: 4321, icon: Icons.Smartphone },
  { platform: 'Web', count: 987, icon: Icons.Globe }
];

export function DeviceStats() {
  const total = mockData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {mockData.map(({ platform, count, icon: Icon }) => (
        <div key={platform} className="flex items-center space-x-3">
          <Icon className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">{platform}</span>
              <span className="text-white">{((count / total) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}