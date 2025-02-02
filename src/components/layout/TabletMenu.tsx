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
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black z-50 px-4 flex items-center justify-between">
        <Logo className="h-6 w-auto text-white" />
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 mt-16"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div className={`
        md:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-black z-40 transform transition-transform duration-200 ease-in-out
        border-l border-gray-800
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Main Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {mainMenuItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => handleNavigate(label)}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                  activeSection === label.toLowerCase()
                    ? 'text-white bg-gray-900 font-medium'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </button>
            ))}
          </nav>

          {/* Secondary Menu */}
          <div className="p-4 border-t border-gray-800">
            {secondaryMenuItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => handleNavigate(label)}
                className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-gray-400 hover:bg-gray-800"
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </button>
            ))}
          </div>
          
          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-red-400 hover:bg-gray-800"
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