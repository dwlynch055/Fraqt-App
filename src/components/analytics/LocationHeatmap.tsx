import React from 'react';

const mockData = [
  { location: 'New York', count: 2345 },
  { location: 'Los Angeles', count: 1876 },
  { location: 'Chicago', count: 1543 },
  { location: 'Houston', count: 987 },
  { location: 'Phoenix', count: 765 }
];

export function LocationHeatmap() {
  const maxCount = Math.max(...mockData.map(d => d.count));

  return (
    <div className="space-y-4">
      {mockData.map(({ location, count }) => (
        <div key={location} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{location}</span>
            <span className="text-white">{count.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}