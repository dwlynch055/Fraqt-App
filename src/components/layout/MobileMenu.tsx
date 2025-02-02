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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div className={`
        fixed inset-y-0 left-0 w-[280px] bg-black border-r border-gray-800 z-50 
        transform transition-transform duration-300 ease-in-out md:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            <div className="flex items-center">
              <Logo className="h-6 w-auto text-white" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <div className="flex h-9 items-center gap-2 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm text-gray-400 border border-gray-800 hover:border-gray-700 transition-colors">
                <Icons.Search className="h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent outline-none placeholder:text-gray-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {activeSection === 'settings' && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    <button 
                      onClick={handleBackToMain}
                      className="flex items-center text-white font-bold hover:text-gray-200 transition-colors"
                    >
                      <Icons.ArrowLeft className="w-4 h-4 mr-2" />
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
                  className={`flex items-center w-full h-10 px-3 text-sm rounded-lg transition-colors ${
                    (activeSection === 'settings' ? activeSettingsSection === id : activeSection === id)
                      ? 'text-white bg-gray-900 font-medium'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{label}</span>
                  {id === 'integrations' && (
                    <span className="ml-2 px-1.5 py-0.5 text-[9px] font-medium bg-purple-500/40 text-white-400 rounded-full">
                      BETA
                    </span>
                  )}
                  {id === 'engage' && (
                    <span className="ml-2 px-1.5 py-0.5 text-[9px] font-medium bg-purple-500/40 text-white-400 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                  }}
                  className="flex items-center w-full h-10 px-3 text-sm rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <Icons.Settings className="w-5 h-5 mr-3" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    onNavigate('forum');
                    onClose();
                  }}
                  className="flex items-center w-full h-10 px-3 text-sm rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <Icons.MessagesSquare className="w-5 h-5 mr-3" />
                  Forum
                </button>
                <button
                  onClick={() => {
                    onNavigate('help');
                    onClose();
                  }}
                  className="flex items-center w-full h-10 px-3 text-sm rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <Icons.HelpCircle className="w-5 h-5 mr-3" />
                  Help
                </button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="flex items-center w-full h-10 px-3 text-sm rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
            >
              <Icons.LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}