import React, { useState } from 'react';
import { Icons } from '../../icons';
import type { CustomMetric, Filter } from '../../../types/analytics';

interface MetricBuilderProps {
  onSave: (metric: CustomMetric) => void;
  onClose: () => void;
  initialMetric?: CustomMetric;
}

export function MetricBuilder({ onSave, onClose, initialMetric }: MetricBuilderProps) {
  const [metric, setMetric] = useState<CustomMetric>(
    initialMetric || {
      id: crypto.randomUUID(),
      name: '',
      formula: '',
      sources: [],
      filters: [],
      segments: []
    }
  );

  const handleAddFilter = () => {
    const newFilter: Filter = {
      field: '',
      operator: 'equals',
      value: ''
    };
    setMetric({
      ...metric,
      filters: [...(metric.filters || []), newFilter]
    });
  };

  const handleRemoveFilter = (index: number) => {
    setMetric({
      ...metric,
      filters: metric.filters?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black rounded-xl w-full max-w-2xl border border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">Custom Metric Builder</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Metric Name
            </label>
            <input
              type="text"
              value={metric.name}
              onChange={(e) => setMetric({ ...metric, name: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Average Revenue Per User"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Formula
            </label>
            <div className="relative">
              <input
                type="text"
                value={metric.formula}
                onChange={(e) => setMetric({ ...metric, formula: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., revenue / active_users"
              />
              <button className="absolute right-2 top-2 p-1 text-gray-400 hover:text-white">
                <Icons.Function className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Use mathematical operators (+, -, *, /) and metric names
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data Sources
            </label>
            <div className="space-y-2">
              {['revenue', 'active_users', 'transactions'].map((source) => (
                <label key={source} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={metric.sources.includes(source)}
                    onChange={(e) => {
                      const sources = e.target.checked
                        ? [...metric.sources, source]
                        : metric.sources.filter((s) => s !== source);
                      setMetric({ ...metric, sources });
                    }}
                    className="w-4 h-4 text-blue-500 bg-gray-900 border-gray-800 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Filters</label>
              <button
                onClick={handleAddFilter}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Add Filter
              </button>
            </div>
            <div className="space-y-3">
              {metric.filters?.map((filter, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={filter.field}
                    onChange={(e) => {
                      const filters = [...(metric.filters || [])];
                      filters[index] = { ...filter, field: e.target.value };
                      setMetric({ ...metric, filters });
                    }}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white"
                  >
                    <option value="">Select field</option>
                    <option value="country">Country</option>
                    <option value="device">Device</option>
                    <option value="source">Source</option>
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(e) => {
                      const filters = [...(metric.filters || [])];
                      filters[index] = { ...filter, operator: e.target.value as Filter['operator'] };
                      setMetric({ ...metric, filters });
                    }}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white"
                  >
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="gt">Greater than</option>
                    <option value="lt">Less than</option>
                  </select>
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => {
                      const filters = [...(metric.filters || [])];
                      filters[index] = { ...filter, value: e.target.value };
                      setMetric({ ...metric, filters });
                    }}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white"
                    placeholder="Value"
                  />
                  <button
                    onClick={() => handleRemoveFilter(index)}
                    className="p-1.5 text-gray-400 hover:text-white"
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-800 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(metric)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Metric
          </button>
        </div>
      </div>
    </div>
  );
}