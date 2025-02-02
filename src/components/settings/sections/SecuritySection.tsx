import React from 'react';
import { Icons } from '../../icons';

interface SecuritySetting {
  title: string;
  description: string;
  enabled: boolean;
}

const securitySettings: SecuritySetting[] = [
  {
    title: 'Two-factor authentication',
    description: 'Add an extra layer of security to your account',
    enabled: true
  },
  {
    title: 'API key rotation',
    description: 'Automatically rotate API keys every 90 days',
    enabled: false
  },
  {
    title: 'Session management',
    description: 'Control active sessions and devices',
    enabled: true
  },
  {
    title: 'IP allowlist',
    description: 'Restrict API access to specific IP addresses',
    enabled: false
  }
];

export function SecuritySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Security Settings</h2>
        <p className="text-sm text-gray-400 mt-1">
          Configure authentication and security controls
        </p>
      </div>

      <div className="space-y-6">
        {securitySettings.map((setting) => (
          <div
            key={setting.title}
            className="p-6 bg-gray-900 rounded-lg border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-white">{setting.title}</h3>
                <p className="text-sm text-gray-400">{setting.description}</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={setting.enabled}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:ring-offset-2 focus:ring-offset-black
                    ${setting.enabled ? 'bg-blue-500' : 'bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      transition-transform duration-200
                      ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { icon: Icons.LogIn, text: 'New login from Chrome on macOS' },
            { icon: Icons.Key, text: 'API key created' },
            { icon: Icons.Shield, text: '2FA enabled' }
          ].map((activity, i) => (
            <div key={i} className="flex items-center space-x-3 text-sm">
              <activity.icon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{activity.text}</span>
              <span className="text-gray-500">
                {Math.floor(Math.random() * 24)}h ago
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}