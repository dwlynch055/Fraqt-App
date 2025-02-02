import React from 'react';
import { Icons } from '../../icons';

interface UsageMetric {
  name: string;
  value: number;
  limit: number;
  unit: string;
}

const mockMetrics: UsageMetric[] = [
  {
    name: 'API Calls',
    value: 1234567,
    limit: 2000000,
    unit: 'calls'
  },
  {
    name: 'Storage',
    value: 45,
    limit: 100,
    unit: 'GB'
  },
  {
    name: 'Bandwidth',
    value: 789,
    limit: 1000,
    unit: 'GB'
  }
];

export function UsageSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Usage & Limits</h2>
        <p className="text-sm text-gray-400 mt-1">
          Monitor your API usage and resource consumption
        </p>
      </div>

      <div className="grid gap-6">
        {mockMetrics.map((metric) => {
          const percentage = (metric.value / metric.limit) * 100;
          return (
            <div key={metric.name} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{metric.name}</h3>
                  <p className="text-sm text-gray-400">
                    {metric.value.toLocaleString()} / {metric.limit.toLocaleString()} {metric.unit}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-400">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-4">Usage History</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <Icons.BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">
                  {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
              <span className="text-gray-400">
                {Math.floor(Math.random() * 10000).toLocaleString()} calls
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}