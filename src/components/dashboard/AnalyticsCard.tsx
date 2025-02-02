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
      className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] w-full" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={title}
    > 
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-full transition-colors hover:border-gray-700 active:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-gray-400">{title}</p>
            <p className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          <div className="p-2 sm:p-3 rounded-lg bg-gray-900 border border-gray-800">
            <Icon className="w-6 h-6 text-white" />
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