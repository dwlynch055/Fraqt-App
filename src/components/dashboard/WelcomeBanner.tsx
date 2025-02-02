import React from 'react';
import { Icons } from '../icons';
import { useNavigationStore } from '../../stores/navigationStore';

export function WelcomeBanner() {
  const { setActiveSection } = useNavigationStore();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Icons.Code2 className="h-8 w-8 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-medium text-white">Start Building with Fraqt AI</h3>
          <p className="mb-2 text-[15px] text-gray-400">
            Get started with Fraqt AI's powerful digital pass platform. Here are some resources to
            help you begin:
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            <button
              onClick={() => setActiveSection('templates')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Icons.FileCode className="h-4 w-4" />
              <span>Explore Pass Templates</span>
            </button>
            <button
              onClick={() => setActiveSection('guides')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Icons.GraduationCap className="h-4 w-4" />
              <span>Integration Guides</span>
            </button>
            <button
              onClick={() => setActiveSection('examples')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Icons.Code2 className="h-4 w-4" />
              <span>Sample Projects</span>
            </button>
            <button
              onClick={() => setActiveSection('quickstart')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Icons.Rocket className="h-4 w-4" />
              <span>Quick Start Guide</span>
            </button>
            <button
              onClick={() => setActiveSection('sdks')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Icons.Package className="h-4 w-4" />
              <span>SDKs & Libraries</span>
            </button>
            <button
              onClick={() => setActiveSection('tools')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Icons.Terminal className="h-4 w-4" aria-hidden="true" />
              <span>Developer Tools</span>
            </button>
            <button
              onClick={() => setActiveSection('community')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <Icons.Users className="h-4 w-4" />
              <span>Community & Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
