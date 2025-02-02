import React from 'react';
import { Icons } from '../../icons';
import type { Widget } from '../../../types/analytics';

interface WidgetLibraryProps {
  onClose: () => void;
  onSelectWidget: (widget: Widget) => void;
}

const WIDGET_TEMPLATES = [
  {
    type: 'metric',
    title: 'Key Metric',
    icon: Icons.Activity,
    description: 'Display a single important metric with comparison'
  },
  {
    type: 'chart',
    title: 'Time Series',
    icon: Icons.LineChart,
    description: 'Visualize trends over time'
  },
  {
    type: 'table',
    title: 'Data Table',
    icon: Icons.Table,
    description: 'Show detailed data in a sortable table'
  },
  {
    type: 'map',
    title: 'Geographic Map',
    icon: Icons.Map,
    description: 'Display data on an interactive map'
  }
];

export function WidgetLibrary({ onClose, onSelectWidget }: WidgetLibraryProps) {
  const handleSelectTemplate = (type: string) => {
    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type: type as Widget['type'],
      title: 'New Widget',
      position: { x: 0, y: 0, w: 1, h: 1 },
      config: {}
    };
    onSelectWidget(newWidget);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black rounded-xl w-full max-w-2xl border border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">Widget Library</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WIDGET_TEMPLATES.map(({ type, title, icon: Icon, description }) => (
              <button
                key={type}
                onClick={() => handleSelectTemplate(type)}
                className="flex items-start p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors text-left"
              >
                <Icon className="w-5 h-5 text-blue-400 mt-1 mr-4" />
                <div>
                  <h4 className="text-sm font-medium text-white">{title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}