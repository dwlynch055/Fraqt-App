import React from 'react';
import { Icons } from '../icons';

const mockData = [
  { platform: 'iOS', count: 6543, icon: Icons.Apple },
  { platform: 'Android', count: 4321, icon: Icons.Smartphone },
  { platform: 'Web', count: 987, icon: Icons.Globe },
];

export function DeviceStats() {
  const total = mockData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {mockData.map(({ platform, count, icon: Icon }) => (
        <div key={platform} className="flex items-center space-x-3">
          <Icon className="h-4 w-4 text-gray-400" />
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gray-400">{platform}</span>
              <span className="text-white">{((count / total) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-900">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
