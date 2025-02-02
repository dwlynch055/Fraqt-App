import React, { useState, useRef, useEffect } from 'react';
import { useNavigationStore } from '../../stores/navigationStore';
import { Icons } from '../icons';
import { useAuth } from '../../hooks/useAuth';
import { UserAvatar } from '../common/UserAvatar';
import { Logo } from '../icons/Logo';
import { Command } from 'lucide-react';
import { SettingsDropdown } from './SettingsDropdown';

interface TopNavProps {
  onMobileMenuOpen: () => void;
}

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  email: string;
  onNavigate: (section: string) => void;
  onSignOut: () => void;
}

function ProfileDropdown({
  isOpen,
  onClose,
  displayName,
  email,
  onNavigate,
  onSignOut,
}: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed right-6 top-[4.5rem] z-50 w-[calc(100vw-24px)] max-w-sm rounded-lg border border-gray-800 bg-black py-2 shadow-lg"
    >
      <div className="border-b border-gray-800 px-4 py-3">
        <p className="text-sm font-medium text-white">{displayName}</p>
        <p className="mt-0.5 text-xs text-gray-400">{email}</p>
      </div>

      <div className="py-2">
        <button
          onClick={() => onNavigate('profile')}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Icons.User className="mr-3 h-4 w-4" />
          Profile
        </button>
        <button
          onClick={() => onNavigate('billing')}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Icons.CreditCard className="mr-3 h-4 w-4" />
          Billing
        </button>
        <button
          onClick={() => onNavigate('security')}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Icons.Shield className="mr-3 h-4 w-4" />
          Security
        </button>
      </div>

      <div className="border-t border-gray-800 py-2">
        <button
          onClick={onSignOut}
          className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300"
        >
          <Icons.LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function TopNav({ onMobileMenuOpen }: TopNavProps) {
  const { activeSection, setActiveSection, setActiveSettingsSection } = useNavigationStore();
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Get name from email if no name is set
  const displayName = user?.email?.split('@')[0] || 'User';

  const handleNavigate = (section: string) => {
    setActiveSection('settings');
    setActiveSettingsSection(section);
    setShowProfileMenu(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div
      className="sticky top-0 z-10 h-16 border-b border-gray-800 bg-black/90 backdrop-blur-sm md:pl-0"
      style={{ marginTop: '5px' }}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Mobile Logo */}
        <div className="md:hidden">
          <Logo className="h-[1.8rem] w-auto text-white" />
        </div>

        {/* Desktop Search */}
        <div className="hidden max-w-xl flex-1 md:block">
          <div className="flex items-center gap-4">
            {useNavigationStore().isSidebarCollapsed && (
              <div
                className="flex-shrink-0 cursor-pointer"
                style={{ marginLeft: '-12px' }}
                onClick={() => setActiveSection('dashboard')}
              >
                <Logo className="h-[1.8rem] w-auto text-white" />
              </div>
            )}
            <div
              className="flex h-10 w-full items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 text-gray-400 transition-colors hover:border-gray-700"
              style={{ marginLeft: useNavigationStore().isSidebarCollapsed ? '15px' : '-7px' }}
            >
              <Command className="h-5 w-5" />
              <input
                type="text"
                placeholder="Type / to search"
                className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-gray-500"
              />
              <kbd className="hidden h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-xs font-medium text-gray-400 sm:inline-flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <div className="hidden items-center space-x-4 md:flex">
            <button
              className={`px-2 text-sm ${activeSection === 'dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-2 text-sm ${activeSection === 'docs' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveSection('docs')}
            >
              Docs
            </button>
            <button
              className={`px-2 text-sm ${activeSection === 'api' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveSection('api')}
            >
              API Reference
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuOpen}
            className="rounded-lg border border-gray-800 bg-gradient-to-b from-white/5 to-transparent p-3 text-gray-400 backdrop-blur-sm transition-all hover:border-gray-700 hover:text-white active:bg-gray-800 md:hidden"
          >
            <Icons.Menu className="h-6 w-6" />
          </button>

          {/* Settings and Profile Icons */}
          <div className="hidden items-center space-x-1 md:flex">
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white active:bg-gray-700"
              >
                <Icons.Settings className="h-5 w-5" />
              </button>
              <SettingsDropdown
                isOpen={showSettingsMenu}
                onClose={() => setShowSettingsMenu(false)}
                onNavigate={handleNavigate}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2"
              >
                <UserAvatar name={displayName} />
              </button>
              <ProfileDropdown
                isOpen={showProfileMenu}
                onClose={() => setShowProfileMenu(false)}
                displayName={displayName}
                email={user?.email || ''}
                onNavigate={handleNavigate}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
