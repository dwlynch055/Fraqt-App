import React, { useState, useCallback } from 'react';
import { Icons } from '../icons';
import { Logo } from '../icons/Logo';
import { useAuth } from '../../hooks/useAuth';

interface TabletMenuProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function TabletMenu({ activeSection, onNavigate }: TabletMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut]);

  const mainMenuItems = [
    { icon: Icons.LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Icons.CreditCard, label: 'Passes', id: 'passes' },
    { icon: Icons.Users, label: 'Customers', id: 'customers' },
    { icon: Icons.BarChart3, label: 'Analytics', id: 'analytics' },
    { icon: Icons.Boxes, label: 'Integrations', id: 'integrations' },
    { icon: Icons.Settings, label: 'Settings', id: 'settings' },
  ];

  const secondaryMenuItems = [
    { icon: Icons.Code2, label: 'Cookbook', id: 'cookbook' },
    { icon: Icons.MessagesSquare, label: 'Forum', id: 'forum' },
    { icon: Icons.HelpCircle, label: 'Help', id: 'help' },
  ];

  const handleNavigate = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <>
      {/* Tablet Header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between bg-black px-4 md:hidden">
        <Logo className="h-6 w-auto text-white" />
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 mt-16 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-l border-gray-800 bg-black transition-transform duration-200 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
      >
        <div className="flex h-full flex-col">
          {/* Main Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {mainMenuItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => handleNavigate(label)}
                className={`flex w-full items-center rounded-lg px-4 py-2 text-sm ${
                  activeSection === label.toLowerCase()
                    ? 'bg-gray-900 font-medium text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>

          {/* Secondary Menu */}
          <div className="border-t border-gray-800 p-4">
            {secondaryMenuItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => handleNavigate(label)}
                className="flex w-full items-center rounded-lg px-4 py-2 text-sm text-gray-400 hover:bg-gray-800"
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Sign Out Button */}
          <div className="border-t border-gray-800 p-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
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
