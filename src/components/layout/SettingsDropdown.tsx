import React, { useRef, useEffect } from 'react';
import { Icons } from '../icons';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

export function SettingsDropdown({ isOpen, onClose, onNavigate }: SettingsDropdownProps) {
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

  const settingsItems = [
    { id: 'profile', label: 'Profile', icon: Icons.User },
    { id: 'api-keys', label: 'API Keys', icon: Icons.Key },
    { id: 'team', label: 'Team', icon: Icons.Users },
    { id: 'billing', label: 'Billing', icon: Icons.CreditCard },
    { id: 'security', label: 'Security', icon: Icons.Shield },
    { id: 'webhooks', label: 'Webhooks', icon: Icons.Webhook },
    { id: 'certificates', label: 'Certificates', icon: Icons.Key },
  ];

  return (
    <div
      ref={dropdownRef}
      className="fixed right-6 top-[4.5rem] z-50 w-[calc(100vw-24px)] max-w-sm rounded-lg border border-gray-800 bg-black py-2 shadow-lg"
    >
      {settingsItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => {
            onNavigate(id);
            onClose();
          }}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Icon className="mr-3 h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
