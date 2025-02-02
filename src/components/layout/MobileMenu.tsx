import React from 'react';
import { Icons } from '../icons';
import { Logo } from '../icons/Logo';
import { useNavigationStore } from '../../stores/navigationStore';
import { useCallback } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{
    icon: React.ElementType;
    label: string;
    id: string;
  }>;
  onNavigate: (section: string) => void;
  onSignOut: () => void;
}

export function MobileMenu({ isOpen, onClose, navItems, onNavigate, onSignOut }: MobileMenuProps) {
  const { activeSection, activeSettingsSection, setActiveSection } = useNavigationStore();

  const handleBackToMain = useCallback(() => {
    setActiveSection('dashboard');
  }, [setActiveSection]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-gray-800 bg-black transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
            <div className="flex items-center">
              <Logo className="h-6 w-auto text-white" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="border-b border-gray-800 p-4">
            <div className="relative">
              <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-400 transition-colors hover:border-gray-700">
                <Icons.Search className="h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {activeSection === 'settings' && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    <button
                      onClick={handleBackToMain}
                      className="flex items-center font-bold text-white transition-colors hover:text-gray-200"
                    >
                      <Icons.ArrowLeft className="mr-2 h-4 w-4" />
                      Main Menu
                    </button>
                  </div>
                </div>
              )}
              {navItems.map(({ icon: Icon, label, id }) => (
                <button
                  key={id}
                  onClick={() => {
                    if (id === 'settings') {
                      onNavigate(id);
                    } else {
                      onNavigate(id);
                      onClose();
                    }
                  }}
                  className={`flex h-10 w-full items-center rounded-lg px-3 text-sm transition-colors ${
                    (
                      activeSection === 'settings'
                        ? activeSettingsSection === id
                        : activeSection === id
                    )
                      ? 'bg-gray-900 font-medium text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span>{label}</span>
                  {id === 'integrations' && (
                    <span className="text-white-400 ml-2 rounded-full bg-purple-500/40 px-1.5 py-0.5 text-[9px] font-medium">
                      BETA
                    </span>
                  )}
                  {id === 'engage' && (
                    <span className="text-white-400 ml-2 rounded-full bg-purple-500/40 px-1.5 py-0.5 text-[9px] font-medium">
                      Coming Soon
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                  }}
                  className="flex h-10 w-full items-center rounded-lg px-3 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <Icons.Settings className="mr-3 h-5 w-5" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    onNavigate('forum');
                    onClose();
                  }}
                  className="flex h-10 w-full items-center rounded-lg px-3 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <Icons.MessagesSquare className="mr-3 h-5 w-5" />
                  Forum
                </button>
                <button
                  onClick={() => {
                    onNavigate('help');
                    onClose();
                  }}
                  className="flex h-10 w-full items-center rounded-lg px-3 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <Icons.HelpCircle className="mr-3 h-5 w-5" />
                  Help
                </button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="flex h-10 w-full items-center rounded-lg px-3 text-sm text-red-400 transition-colors hover:bg-gray-800 hover:text-red-300"
            >
              <Icons.LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
