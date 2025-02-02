import React from 'react';
import { Icons } from '../icons';
import { EngagementChart } from './EngagementChart';
import { PassDistributionChart } from './PassDistributionChart';
import { RetentionMetrics } from './RetentionMetrics';
import { LocationHeatmap } from './LocationHeatmap';
import { DeviceStats } from './DeviceStats';
import { RedemptionStats } from './RedemptionStats';
import { DateRangeSelector } from './DateRangeSelector';

export function AnalyticsOverview() {
  const [dateRange, setDateRange] = React.useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  return (
    <div className="space-y-8">
      <DateRangeSelector
        startDate={dateRange.start}
        endDate={dateRange.end}
        onDateChange={handleDateChange}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-800 bg-black p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Pass Distribution</h3>
            <Icons.PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <PassDistributionChart />
        </div>

        <div className="rounded-lg border border-gray-800 bg-black p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">User Retention</h3>
            <Icons.Users className="h-5 w-5 text-gray-400" />
          </div>
          <RetentionMetrics />
        </div>

        <div className="rounded-lg border border-gray-800 bg-black p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Device Usage</h3>
            <Icons.Smartphone className="h-5 w-5 text-gray-400" />
          </div>
          <DeviceStats />
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="rounded-lg border border-gray-800 bg-black p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">Engagement Trends</h3>
            <p className="mt-1 text-sm text-gray-400">Pass usage patterns over time</p>
          </div>
          <select className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        <EngagementChart />
      </div>

      {/* Location & Redemption Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-800 bg-black p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Geographic Distribution</h3>
            <Icons.Map className="h-5 w-5 text-gray-400" />
          </div>
          <LocationHeatmap />
        </div>

        <div className="rounded-lg border border-gray-800 bg-black p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Redemption Analytics</h3>
            <Icons.Ticket className="h-5 w-5 text-gray-400" />
          </div>
          <RedemptionStats />
        </div>
      </div>
    </div>
  );
}
