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
    description: 'Display a single important metric with comparison',
  },
  {
    type: 'chart',
    title: 'Time Series',
    icon: Icons.LineChart,
    description: 'Visualize trends over time',
  },
  {
    type: 'table',
    title: 'Data Table',
    icon: Icons.Table,
    description: 'Show detailed data in a sortable table',
  },
  {
    type: 'map',
    title: 'Geographic Map',
    icon: Icons.Map,
    description: 'Display data on an interactive map',
  },
];

export function WidgetLibrary({ onClose, onSelectWidget }: WidgetLibraryProps) {
  const handleSelectTemplate = (type: string) => {
    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type: type as Widget['type'],
      title: 'New Widget',
      position: { x: 0, y: 0, w: 1, h: 1 },
      config: {},
    };
    onSelectWidget(newWidget);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-gray-800 bg-black">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <h3 className="text-lg font-medium text-white">Widget Library</h3>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WIDGET_TEMPLATES.map(({ type, title, icon: Icon, description }) => (
              <button
                key={type}
                onClick={() => handleSelectTemplate(type)}
                className="flex items-start rounded-lg bg-gray-900 p-4 text-left transition-colors hover:bg-gray-800"
              >
                <Icon className="mr-4 mt-1 h-5 w-5 text-blue-400" />
                <div>
                  <h4 className="text-sm font-medium text-white">{title}</h4>
                  <p className="mt-1 text-xs text-gray-400">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
