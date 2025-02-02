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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black rounded-xl w-full max-w-3xl border border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">Edit Widget</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Data
          </button>
          <button
            onClick={() => setActiveTab('visualization')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'visualization'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Visualization
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editedWidget.title}
                  onChange={(e) =>
                    setEditedWidget({ ...editedWidget, title: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editedWidget.description || ''}
                  onChange={(e) =>
                    setEditedWidget({ ...editedWidget, description: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-white mb-4">Metric Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Formula
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., (revenue - costs) / users"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Data Sources
                    </label>
                    <select className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                      <option value="revenue">Revenue</option>
                      <option value="users">Users</option>
                      <option value="engagement">Engagement</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-4">Filters</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <select className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                      <option value="country">Country</option>
                      <option value="device">Device</option>
                      <option value="source">Source</option>
                    </select>
                    <select className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                      <option value="gt">Greater than</option>
                      <option value="lt">Less than</option>
                    </select>
                    <input
                      type="text"
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Value"
                    />
                    <button className="p-2 text-gray-400 hover:text-white">
                      <Icons.Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visualization' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chart Type
                </label>
                <select className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="area">Area Chart</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color Scheme
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['blue', 'green', 'purple', 'orange', 'red'].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-${color}-400`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-800 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}