import React, { useState } from 'react';
import { Icons } from '../../icons';
import { WidgetGrid } from './WidgetGrid';
import { WidgetLibrary } from './WidgetLibrary';
import { WidgetEditor } from './WidgetEditor';
import type { Widget } from '../../../types/analytics';

export function DashboardBuilder() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleAddWidget = (widget: Widget) => {
    setWidgets([...widgets, widget]);
    setShowLibrary(false);
  };

  const handleUpdateWidget = (updatedWidget: Widget) => {
    setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    setEditingWidget(null);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Dashboard Builder</h2>
          <p className="text-sm text-gray-400">Customize your analytics dashboard</p>
        </div>
        <button
          onClick={() => setShowLibrary(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Widget
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <WidgetGrid
          widgets={widgets}
          onEditWidget={setEditingWidget}
          onDeleteWidget={handleDeleteWidget}
        />
      </div>

      {showLibrary && (
        <WidgetLibrary
          onClose={() => setShowLibrary(false)}
          onSelectWidget={handleAddWidget}
        />
      )}

      {editingWidget && (
        <WidgetEditor
          widget={editingWidget}
          onClose={() => setEditingWidget(null)}
          onSave={handleUpdateWidget}
        />
      )}
    </div>
  );
}