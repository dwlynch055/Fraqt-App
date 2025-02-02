import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { PassTemplate } from '../../types';

interface PassTemplateFormProps {
  onClose: () => void;
  onSubmit: (template: Omit<PassTemplate, 'id'>) => void;
}

export function PassTemplateForm({ onClose, onSubmit }: PassTemplateFormProps) {
  const [formData, setFormData] = useState<Omit<PassTemplate, 'id'>>({
    name: '',
    description: '',
    style: {
      backgroundColor: '#1e40af',
      foregroundColor: '#ffffff',
      labelColor: '#93c5fd',
    },
    nfcEnabled: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Pass Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Background</label>
              <input
                type="color"
                value={formData.style.backgroundColor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    style: { ...formData.style, backgroundColor: e.target.value },
                  })
                }
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Text</label>
              <input
                type="color"
                value={formData.style.foregroundColor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    style: { ...formData.style, foregroundColor: e.target.value },
                  })
                }
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Labels</label>
              <input
                type="color"
                value={formData.style.labelColor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    style: { ...formData.style, labelColor: e.target.value },
                  })
                }
                className="mt-1 block w-full"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.nfcEnabled}
              onChange={(e) => setFormData({ ...formData, nfcEnabled: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Enable NFC</label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}