import React from 'react';
import { Icons } from '../../icons';
import type { Widget } from '../../../types/analytics';

interface WidgetRendererProps {
  widget: Widget;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const renderContent = () => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="text-center">
            <div className="text-3xl font-semibold text-white">2,547</div>
            <div className="flex items-center justify-center mt-2 text-sm">
              <Icons.TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">12.3%</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className="h-64 flex items-center justify-center">
            <Icons.BarChart3 className="w-12 h-12 text-gray-600" />
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Source</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="px-4 py-2 text-sm text-gray-300">Direct</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-300">1,234</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-300">Referral</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-300">567</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'map':
        return (
          <div className="h-64 flex items-center justify-center">
            <Icons.Map className="w-12 h-12 text-gray-600" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
}