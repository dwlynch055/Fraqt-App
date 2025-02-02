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
    setWidgets(widgets.map((w) => (w.id === updatedWidget.id ? updatedWidget : w)));
    setEditingWidget(null);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Dashboard Builder</h2>
          <p className="text-sm text-gray-400">Customize your analytics dashboard</p>
        </div>
        <button
          onClick={() => setShowLibrary(true)}
          className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Icons.Plus className="mr-2 h-4 w-4" />
          Add Widget
        </button>
      </div>

      <div className="min-h-0 flex-1">
        <WidgetGrid
          widgets={widgets}
          onEditWidget={setEditingWidget}
          onDeleteWidget={handleDeleteWidget}
        />
      </div>

      {showLibrary && (
        <WidgetLibrary onClose={() => setShowLibrary(false)} onSelectWidget={handleAddWidget} />
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
