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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Pass Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 block text-sm text-gray-900">Enable NFC</label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
