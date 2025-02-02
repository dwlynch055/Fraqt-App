import React, { useState } from 'react';
import { Icons } from '../icons';

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'connected' | 'not_connected' | 'error';
  children: React.ReactNode;
}

export function IntegrationCard({
  name,
  description,
  icon: Icon,
  status,
  children
}: IntegrationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative bg-gradient-to-b from-black to-gray-900/50 rounded-lg border border-gray-800 transition-all duration-300 hover:border-gray-700">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      <div className="p-6">
        <div className="relative flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gray-900/80 rounded-lg shadow-lg backdrop-blur-sm border border-gray-800/50 transition-colors group-hover:border-gray-700/50">
              <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{name}</h3>
              <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">{description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {status === 'connected' && (
              <span className="flex items-center text-sm bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-sm shadow-green-500/50 animate-pulse" />
                <span className="text-green-400 font-medium">Connected</span>
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <Icons.ChevronRight 
                className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
              />
            </button>
          </div>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-800 p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-transparent pointer-events-none" />
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}