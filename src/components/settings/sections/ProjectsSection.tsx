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
    apiCalls: 1234567
  },
  {
    name: 'Staging',
    environment: 'staging',
    status: 'Active',
    lastDeployed: '4h ago',
    apiCalls: 45678
  }
];

export function ProjectsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Projects</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your projects and environments
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Icons.Plus className="w-4 h-4 mr-2" />
          Create project
        </button>
      </div>

      <div className="grid gap-4">
        {mockProjects.map((project) => (
          <div key={project.name} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icons.Folder className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">{project.name}</h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                  {project.environment}
                </span>
              </div>
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                <Icons.MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Status</p>
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                  <span className="text-white">{project.status}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Last deployed</p>
                <p className="text-white">{project.lastDeployed}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">API calls</p>
                <p className="text-white">{project.apiCalls.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}