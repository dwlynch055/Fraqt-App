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

function ProfileDropdown({ isOpen, onClose, displayName, email, onNavigate, onSignOut }: ProfileDropdownProps) {
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
      className="fixed right-6 top-[4.5rem] w-[calc(100vw-24px)] max-w-sm bg-black border border-gray-800 rounded-lg shadow-lg py-2 z-50"
    >
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-sm font-medium text-white">{displayName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{email}</p>
      </div>
      
      <div className="py-2">
        <button
          onClick={() => onNavigate('profile')}
          className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 flex items-center"
        >
          <Icons.User className="w-4 h-4 mr-3" />
          Profile
        </button>
        <button
          onClick={() => onNavigate('billing')}
          className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 flex items-center"
        >
          <Icons.CreditCard className="w-4 h-4 mr-3" />
          Billing
        </button>
        <button
          onClick={() => onNavigate('security')}
          className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 flex items-center"
        >
          <Icons.Shield className="w-4 h-4 mr-3" />
          Security
        </button>
      </div>
      
      <div className="border-t border-gray-800 py-2">
        <button
          onClick={onSignOut}
          className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 flex items-center"
        >
          <Icons.LogOut className="w-4 h-4 mr-3" />
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
    <div className="h-16 bg-black/90 backdrop-blur-sm sticky top-0 z-10 md:pl-0 border-b border-gray-800" style={{ marginTop: '5px' }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Mobile Logo */}
        <div className="md:hidden">
          <Logo className="h-[1.8rem] w-auto text-white" />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-xl">
          <div className="flex items-center gap-4">
            {useNavigationStore().isSidebarCollapsed && (
              <div className="cursor-pointer flex-shrink-0" style={{ marginLeft: '-12px' }} onClick={() => setActiveSection('dashboard')}>
                <Logo className="h-[1.8rem] w-auto text-white" />
              </div>
            )}
            <div className="flex h-10 items-center gap-3 w-full rounded-lg bg-gray-900 px-4 text-gray-400 border border-gray-800 hover:border-gray-700 transition-colors" style={{ marginLeft: useNavigationStore().isSidebarCollapsed ? '15px' : '-7px' }}>
              <Command className="h-5 w-5" />
              <input
                type="text"
                placeholder="Type / to search"
                className="flex-1 bg-transparent outline-none placeholder:text-gray-500 text-base h-full"
              />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-xs font-medium text-gray-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className={`text-sm px-2 ${activeSection === 'dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`text-sm px-2 ${activeSection === 'docs' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveSection('docs')}
            >
              Docs
            </button>
            <button 
              className={`text-sm px-2 ${activeSection === 'api' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveSection('api')}
            >
              API Reference
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuOpen}
            className="md:hidden p-3 text-gray-400 hover:text-white active:bg-gray-800 transition-all rounded-lg border border-gray-800 hover:border-gray-700 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm"
          >
            <Icons.Menu className="w-6 h-6" />
          </button>

          {/* Settings and Profile Icons */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors"
              >
                <Icons.Settings className="w-5 h-5" />
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