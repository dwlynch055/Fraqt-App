import React from 'react';

const mockData = {
  daily: 92,
  weekly: 78,
  monthly: 65,
  quarterly: 45,
};

export function RetentionMetrics() {
  return (
    <div className="space-y-4">
      {Object.entries(mockData).map(([period, rate]) => (
        <div key={period} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="capitalize text-gray-400">{period} Active Users</span>
            <span className="text-white">{rate}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-900">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
