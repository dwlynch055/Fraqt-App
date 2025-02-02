import { useNavigationStore } from '../../stores/navigationStore';
import { Icons } from '../icons';
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { Logo } from '../icons/Logo';
import { TopNav } from './TopNav';
import { MobileMenu } from './MobileMenu';
import { PassList } from '../passes/PassList';
import { AnalyticsOverview } from '../analytics/AnalyticsOverview';
import { IntegrationsOverview } from '../integrations/IntegrationsOverview';
import { MerchantSettings } from '../settings/MerchantSettings';
import { Tooltip } from '../ui/Tooltip';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { activeSection, activeSettingsSection, isSidebarCollapsed, setActiveSection, setActiveSettingsSection, toggleSidebar, setSidebarCollapsed } = useNavigationStore();
  const { signOut } = useAuth();
  const { user } = useAuth();
  const { updateProfile, getProfile } = useProfile(user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useSwipeGesture({
    onSwipeLeft: () => setIsMobileMenuOpen(false),
    onSwipeRight: () => !isMobileMenuOpen && setIsMobileMenuOpen(true),
    threshold: 50,
    swipeAreaWidth: 20
  });

  useEffect(() => {
    async function loadSidebarState() {
      if (!user) return;
      
      try {
        const profile = await getProfile();
        if (profile?.sidebar_collapsed !== undefined) {
          setSidebarCollapsed(profile.sidebar_collapsed);
        }
      } catch (error) {
        console.error('Failed to load sidebar preference:', error);
      }
    }
    
    loadSidebarState();
  }, [user, getProfile, setSidebarCollapsed]);

  const handleToggleSidebar = async () => {
    const newState = toggleSidebar();
    if (!user) return;

    try {
      await updateProfile({
        sidebar_collapsed: newState,
        name: '', // Required by type but won't be updated
        phone: ''
      });
    } catch (error) {
      console.error('Failed to persist sidebar preference:', error);
    }
  };

  const handleLogoClick = () => setActiveSection('dashboard');

  const handleNavigate = useCallback((section: string) => {
    if (activeSection === 'settings') {
      setActiveSettingsSection(section.toLowerCase());
    } else {
      setActiveSection(section.toLowerCase());
    }
  }, [activeSection, setActiveSection, setActiveSettingsSection]);

  const navItems = activeSection === 'settings' ? [
    { icon: Icons.User, label: 'Profile', id: 'profile' },
    { icon: Icons.Key, label: 'API Keys', id: 'api-keys' },
    { icon: Icons.Users, label: 'Team', id: 'team' },
    { icon: Icons.CreditCard, label: 'Billing', id: 'billing' },
    { icon: Icons.Shield, label: 'Security', id: 'security' },
    { icon: Icons.Webhook, label: 'Webhooks', id: 'webhooks' },
    { icon: Icons.Key, label: 'Certificates', id: 'certificates' }
  ] : [
    { icon: Icons.LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Icons.CreditCard, label: 'Passes', id: 'passes' },
    { icon: Icons.Brain, label: 'Engage AI', id: 'engage' },
    { icon: Icons.BarChart3, label: 'Analytics', id: 'analytics' },
    { icon: Icons.Boxes, label: 'Integrations', id: 'integrations' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        onNavigate={handleNavigate}
        onSignOut={signOut}
      />

      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col sticky top-0 h-screen bg-black shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-[17rem]'}`}>
        <div className="absolute inset-0 p-3">
          <div className="w-full h-full bg-gradient-to-b from-[#0a1e28] via-[#081823] to-[#040911] rounded-[14px]" />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center h-16 px-6 mt-1.5">
            {!isSidebarCollapsed && (
              <div className="cursor-pointer pl-2" onClick={handleLogoClick}>
                <Logo className="h-[1.8rem] w-auto text-white" />
              </div>
            )}
            <button
              onClick={handleToggleSidebar}
              className={`flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ml-auto ${isSidebarCollapsed ? 'pl-[7px]' : ''}`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Icons.PanelLeftClose className={`w-6 h-6 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
              </div>
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-1 mt-2">
            {activeSection === 'settings' && !isSidebarCollapsed && (
              <div className="mb-4">
                <button 
                  onClick={() => setActiveSection('dashboard')} 
                  className="flex items-center w-full h-9 px-3 text-sm rounded-lg text-white hover:bg-gray-800 transition-colors md:ml-0 ml-[-8px]"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Icons.ArrowLeft className="w-6 h-6" />
                  </div>
                  <span className="ml-3.5 font-medium text-base">Main Menu</span>
                </button>
              </div>
            )}
            {activeSection === 'settings' && isSidebarCollapsed && (
              <Tooltip content="Back to Main Menu">
                <div className="mb-4">
                  <button
                    onClick={() => setActiveSection('dashboard')}
                    className="flex items-center justify-center w-full h-10 text-sm rounded-lg text-white hover:bg-gray-800 transition-colors mx-auto"
                    style={{ width: '48px' }}
                  >
                    <Icons.ArrowLeft className="w-8 h-8 -ml-[2px]" />
                  </button>
                </div>
              </Tooltip>
            )}
            {navItems.map(({ icon: Icon, label, id }) => (
              <div key={id}>
                {isSidebarCollapsed ? (
                  <Tooltip content={label}>
                    <button
                      onClick={() => handleNavigate(id)}
                      className={`flex items-center w-full h-10 px-3 text-[0.9rem] rounded-lg transition-colors justify-start ${
                        (activeSection === 'settings' ? activeSettingsSection === id : activeSection === id) 
                          ? 'text-white bg-gray-900/50 font-medium' 
                          : 'text-gray-400 hover:bg-gray-900/30 hover:text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => handleNavigate(id)}
                    className={`flex items-center w-full h-10 px-3 text-base rounded-lg transition-colors justify-start ${
                      (activeSection === 'settings' ? activeSettingsSection === id : activeSection === id) 
                        ? 'text-white bg-gray-900/50 font-medium' 
                        : 'text-gray-400 hover:bg-gray-900/30 hover:text-white'
                    }`}
                  >
                    <div className="w-6 flex-shrink-0 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="ml-3.5">{label}</span>
                    {id === 'integrations' && (
                      <span className="ml-2 px-1.5 py-0.5 text-[9px] font-medium" style={{ backgroundColor: '#8100fba3', borderRadius: '4px' }}>
                        BETA
                      </span>
                    )}
                    {id === 'engage' && (
                      <span className="ml-2 px-1.5 py-0.5 text-[9px] font-medium" style={{ backgroundColor: '#8100fba3', borderRadius: '4px' }}>
                        Coming Soon
                      </span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </nav>
          
          <div className="px-3 py-6 mt-auto">
            <div className="space-y-1">
              {isSidebarCollapsed ? (
                <>
                  <Tooltip content="Forum">
                    <button
                      onClick={() => handleNavigate('forum')}
                      className="flex items-center w-full h-9 px-3 text-sm rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors justify-center"
                    >
                      <Icons.MessagesSquare className="w-6 h-6" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Help">
                    <button
                      onClick={() => handleNavigate('help')}
                      className="flex items-center w-full h-10 px-3 text-base rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors justify-center"
                    >
                      <Icons.HelpCircle className="w-6 h-6" />
                    </button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate('forum')}
                    className="flex items-center w-full h-10 px-3 text-[0.9rem] rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      <Icons.MessagesSquare className="w-6 h-6" />
                    </div>
                    <span className="ml-3.5">Forum</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('help')}
                    className="flex items-center w-full h-10 px-3 text-[0.9rem] rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      <Icons.HelpCircle className="w-6 h-6" />
                    </div>
                    <span className="ml-3.5">Help</span>
                  </button>
                </>
              )}
            </div>
            
            {isSidebarCollapsed ? (
              <Tooltip content="Sign Out">
                <button
                  onClick={() => signOut()}
                  className="flex items-center w-full h-10 px-4 text-base rounded-lg text-gray-400 hover:bg-gray-800 mt-4 transition-colors justify-center"
                >
                  <Icons.LogOut className="w-6 h-6" />
                </button>
              </Tooltip>
            ) : (
              <button
                onClick={() => signOut()}
                className="flex items-center w-full h-10 px-4 text-[0.9rem] rounded-lg text-gray-400 hover:bg-gray-800 mt-4 transition-colors"
              >
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  <Icons.LogOut className="w-6 h-6" />
                </div>
                <span className="ml-3.5">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-x-hidden">
        <TopNav onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

        <main>
          {activeSection === 'dashboard' && children}
          {activeSection === 'passes' && (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-1xl font-semibold tracking-tight mb-8">Passes</h1>
              <PassList />
            </div>
          )}
          {activeSection === 'engage' && (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-1xl font-semibold tracking-tight mb-8">Engage AI</h1>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <p className="text-gray-600 dark:text-gray-400">Customer engagement features coming soon...</p>
              </div>
            </div>
          )}
          {activeSection === 'analytics' && (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-1xl font-semibold tracking-tight mb-8">Analytics</h1>
              <AnalyticsOverview />
            </div>
          )}
          {activeSection === 'integrations' && (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-1xl font-semibold tracking-tight mb-8">Integrations</h1>
              <IntegrationsOverview />
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-1xl font-semibold tracking-tight mb-8">Settings</h1>
              <MerchantSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}