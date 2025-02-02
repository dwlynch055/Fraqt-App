import React from 'react';
import { Icons } from '../../icons';

interface Project {
  name: string;
  environment: string;
  status: string;
  lastDeployed: string;
  apiCalls: number;
}

const mockProjects: Project[] = [
  {
    name: 'Production',
    environment: 'prod',
    status: 'Active',
    lastDeployed: '2h ago',
    apiCalls: 1234567,
  },
  {
    name: 'Staging',
    environment: 'staging',
    status: 'Active',
    lastDeployed: '4h ago',
    apiCalls: 45678,
  },
];

export function ProjectsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Projects</h2>
          <p className="mt-1 text-sm text-gray-400">Manage your projects and environments</p>
        </div>
        <button className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
          <Icons.Plus className="mr-2 h-4 w-4" />
          Create project
        </button>
      </div>

      <div className="grid gap-4">
        {mockProjects.map((project) => (
          <div key={project.name} className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icons.Folder className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">{project.name}</h3>
                <span className="rounded-full bg-gray-800 px-2 py-1 text-xs font-medium text-gray-300">
                  {project.environment}
                </span>
              </div>
              <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
                <Icons.MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="mb-1 text-gray-400">Status</p>
                <div className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-400"></span>
                  <span className="text-white">{project.status}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-gray-400">Last deployed</p>
                <p className="text-white">{project.lastDeployed}</p>
              </div>
              <div>
                <p className="mb-1 text-gray-400">API calls</p>
                <p className="text-white">{project.apiCalls.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
