import React from 'react';
import { TrendingUp } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ElementType;
  onClick?: () => void;
}

export function AnalyticsCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon = TrendingUp,
  onClick,
}: AnalyticsCardProps) {
  return (
    <div
      className="w-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={title}
    >
      <div className="h-full rounded-lg border border-gray-800 bg-black p-6 transition-colors hover:border-gray-700 active:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-gray-400">{title}</p>
            <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-2 sm:p-3">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        {change && (
          <div className="mt-4">
            <span
              className={`inline-flex items-center text-[13px] font-medium ${
                positive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
