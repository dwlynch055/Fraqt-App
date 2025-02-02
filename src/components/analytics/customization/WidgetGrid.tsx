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
      <div className="flex h-full items-center justify-center rounded-lg border border-gray-800 bg-black">
        <div className="text-center">
          <Icons.LayoutDashboard className="mx-auto mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-400">No widgets added yet</p>
          <p className="mt-2 text-sm text-gray-500">Click "Add Widget" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="overflow-hidden rounded-lg border border-gray-800 bg-black"
          style={{
            gridColumn: `span ${widget.position.w}`,
            gridRow: `span ${widget.position.h}`,
          }}
        >
          <div className="flex items-center justify-between border-b border-gray-800 p-4">
            <div>
              <h3 className="text-sm font-medium text-white">{widget.title}</h3>
              {widget.description && (
                <p className="mt-0.5 text-xs text-gray-400">{widget.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEditWidget(widget)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <Icons.Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteWidget(widget.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <Icons.Trash className="h-4 w-4" />
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
