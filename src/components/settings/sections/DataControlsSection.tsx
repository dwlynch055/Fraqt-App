import React from 'react';
import { Icons } from '../../icons';

interface VisibilityOption {
  id: string;
  label: string;
}

interface VisibilityControl {
  title: string;
  description: string;
  options: VisibilityOption[];
  value: string;
}

const visibilityControls: VisibilityControl[] = [
  {
    title: 'Threads',
    description: 'Threads page shows messages created with the Assistants API and Playground.',
    options: [
      { id: 'hidden', label: 'Hidden' },
      { id: 'organization', label: 'Visible to organization owners' },
      { id: 'everyone', label: 'Visible to everyone' },
    ],
    value: 'hidden',
  },
  {
    title: 'Usage dashboard',
    description: 'Usage dashboard shows activity and costs for your organization.',
    options: [
      { id: 'hidden', label: 'Hidden' },
      { id: 'organization', label: 'Visible to organization owners' },
      { id: 'everyone', label: 'Visible to everyone' },
    ],
    value: 'everyone',
  },
  {
    title: 'Chat Completions',
    description: 'Chat Completions page shows stored completions.',
    options: [
      { id: 'hidden', label: 'Hidden' },
      { id: 'organization', label: 'Visible to organization owners' },
      { id: 'everyone', label: 'Visible to everyone' },
      { id: 'selected', label: 'Visible for selected projects' },
    ],
    value: 'organization',
  },
];

export function DataControlsSection() {
  const [activeTab, setActiveTab] = React.useState('visibility');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Data Controls</h2>
        <p className="mt-1 text-sm text-gray-400">Configure visibility and sharing settings</p>
      </div>

      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
          {['Visibility', 'Sharing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`border-b-2 pb-4 text-sm font-medium ${
                activeTab === tab.toLowerCase()
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-8">
        {visibilityControls.map((control) => (
          <div key={control.title} className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white">{control.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{control.description}</p>
            </div>

            <div className="space-y-3">
              {control.options.map((option) => (
                <label key={option.id} className="flex cursor-pointer items-center space-x-3">
                  <div
                    className={`h-4 w-4 rounded-full border ${
                      control.value === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-600'
                    } flex items-center justify-center`}
                  >
                    {control.value === option.id && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
