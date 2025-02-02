import React from 'react';

const mockData = {
  today: [
    { hour: '00:00', count: 12 },
    { hour: '06:00', count: 8 },
    { hour: '12:00', count: 45 },
    { hour: '18:00', count: 32 }
  ],
  stats: {
    total: 1234,
    average: 28.5,
    peak: 45
  }
};

export function RedemptionStats() {
  const maxCount = Math.max(...mockData.today.map(d => d.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Total Today</div>
          <div className="text-xl font-semibold text-white">{mockData.stats.total}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Average</div>
          <div className="text-xl font-semibold text-white">{mockData.stats.average}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Peak</div>
          <div className="text-xl font-semibold text-white">{mockData.stats.peak}</div>
        </div>
      </div>

      <div className="relative h-32">
        {mockData.today.map((data, i) => (
          <div
            key={data.hour}
            className="absolute bottom-0 bg-blue-500 rounded-t-sm transition-all duration-500"
            style={{
              left: `${(i / (mockData.today.length - 1)) * 100}%`,
              height: `${(data.count / maxCount) * 100}%`,
              width: '20px',
              transform: 'translateX(-10px)'
            }}
          >
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
              {data.count}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-gray-400">
        {mockData.today.map(data => (
          <div key={data.hour}>{data.hour}</div>
        ))}
      </div>
    </div>
  );
}