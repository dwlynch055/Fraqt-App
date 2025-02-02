import React, { useState } from 'react';
import { Icons } from '../../icons';
import type { Widget, CustomMetric, Filter } from '../../../types/analytics';

interface WidgetEditorProps {
  widget: Widget;
  onClose: () => void;
  onSave: (widget: Widget) => void;
}

export function WidgetEditor({ widget, onClose, onSave }: WidgetEditorProps) {
  const [editedWidget, setEditedWidget] = useState<Widget>(widget);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    onSave(editedWidget);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-xl border border-gray-800 bg-black">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <h3 className="text-lg font-medium text-white">Edit Widget</h3>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('general')}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Data
          </button>
          <button
            onClick={() => setActiveTab('visualization')}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === 'visualization'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Visualization
          </button>
        </div>

        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  value={editedWidget.title}
                  onChange={(e) => setEditedWidget({ ...editedWidget, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={editedWidget.description || ''}
                  onChange={(e) =>
                    setEditedWidget({ ...editedWidget, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-sm font-medium text-white">Metric Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Formula</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., (revenue - costs) / users"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Data Sources
                    </label>
                    <select className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                      <option value="revenue">Revenue</option>
                      <option value="users">Users</option>
                      <option value="engagement">Engagement</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-medium text-white">Filters</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <select className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                      <option value="country">Country</option>
                      <option value="device">Device</option>
                      <option value="source">Source</option>
                    </select>
                    <select className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                      <option value="gt">Greater than</option>
                      <option value="lt">Less than</option>
                    </select>
                    <input
                      type="text"
                      className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Value"
                    />
                    <button className="p-2 text-gray-400 hover:text-white">
                      <Icons.Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visualization' && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Chart Type</label>
                <select className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="area">Area Chart</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Color Scheme</label>
                <div className="grid grid-cols-5 gap-2">
                  {['blue', 'green', 'purple', 'orange', 'red'].map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-${color}-400`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-800 px-6 py-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
