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
  children,
}: IntegrationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative rounded-lg border border-gray-800 bg-gradient-to-b from-black to-gray-900/50 transition-all duration-300 hover:border-gray-700">
      <div className="from-blue-500/3 to-purple-500/3 absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="p-6">
        <div className="relative flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="rounded-lg border border-gray-800/50 bg-gray-900/80 p-3 shadow-lg backdrop-blur-sm transition-colors group-hover:border-gray-700/50">
              <Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{name}</h3>
              <p className="mt-1 text-sm text-gray-400 transition-colors group-hover:text-gray-300">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {status === 'connected' && (
              <span className="flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm">
                <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-sm shadow-green-500/50" />
                <span className="font-medium text-green-400">Connected</span>
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-white"
            >
              <Icons.ChevronRight
                className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="relative border-t border-gray-800 p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-900/30 to-transparent" />
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}
