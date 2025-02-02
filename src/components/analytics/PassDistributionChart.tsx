import React from 'react';
import { Icons } from '../icons';

const mockData = [
  { type: 'Loyalty', count: 450, color: '#3B82F6' },
  { type: 'Coupons', count: 280, color: '#10B981' },
  { type: 'Event', count: 170, color: '#6366F1' },
  { type: 'Boarding', count: 100, color: '#F59E0B' }
];

export function PassDistributionChart() {
  const total = mockData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Total Passes</span>
        <span className="text-white font-medium">{total.toLocaleString()}</span>
      </div>

      {mockData.map((item) => (
        <div key={item.type} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{item.type}</span>
            <span className="text-white">{((item.count / total) * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.count / total) * 100}%`,
                backgroundColor: item.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}