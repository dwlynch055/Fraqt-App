import React from 'react';

const mockData = {
  daily: 92,
  weekly: 78,
  monthly: 65,
  quarterly: 45
};

export function RetentionMetrics() {
  return (
    <div className="space-y-4">
      {Object.entries(mockData).map(([period, rate]) => (
        <div key={period} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 capitalize">{period} Active Users</span>
            <span className="text-white">{rate}%</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}