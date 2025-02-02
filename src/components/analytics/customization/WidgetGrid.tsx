import React from 'react';
import { Icons } from '../../icons';
import type { Widget } from '../../../types/analytics';
import { WidgetRenderer } from './WidgetRenderer';

interface WidgetGridProps {
  widgets: Widget[];
  onEditWidget: (widget: Widget) => void;
  onDeleteWidget: (widgetId: string) => void;
}

export function WidgetGrid({ widgets, onEditWidget, onDeleteWidget }: WidgetGridProps) {
  if (widgets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-black border border-gray-800 rounded-lg">
        <div className="text-center">
          <Icons.LayoutDashboard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No widgets added yet</p>
          <p className="text-sm text-gray-500 mt-2">Click "Add Widget" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="bg-black border border-gray-800 rounded-lg overflow-hidden"
          style={{
            gridColumn: `span ${widget.position.w}`,
            gridRow: `span ${widget.position.h}`
          }}
        >
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">{widget.title}</h3>
              {widget.description && (
                <p className="text-xs text-gray-400 mt-0.5">{widget.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditWidget(widget)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                <Icons.Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteWidget(widget.id)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                <Icons.Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <WidgetRenderer widget={widget} />
          </div>
        </div>
      ))}
    </div>
  );
}