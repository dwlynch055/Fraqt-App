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
  const {
    activeSection,
    activeSettingsSection,
    isSidebarCollapsed,
    setActiveSection,
    setActiveSettingsSection,
    toggleSidebar,
    setSidebarCollapsed,
  } = useNavigationStore();
  const { signOut } = useAuth();
  const { user } = useAuth();
  const { updateProfile, getProfile } = useProfile(user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useSwipeGesture({
    onSwipeLeft: () => setIsMobileMenuOpen(false),
    onSwipeRight: () => !isMobileMenuOpen && setIsMobileMenuOpen(true),
    threshold: 50,
    swipeAreaWidth: 20,
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
        phone: '',
      });
    } catch (error) {
      console.error('Failed to persist sidebar preference:', error);
    }
  };

  const handleLogoClick = () => setActiveSection('dashboard');

  const handleNavigate = useCallback(
    (section: string) => {
      if (activeSection === 'settings') {
        setActiveSettingsSection(section.toLowerCase());
      } else {
        setActiveSection(section.toLowerCase());
      }
    },
    [activeSection, setActiveSection, setActiveSettingsSection]
  );

  const navItems =
    activeSection === 'settings'
      ? [
          { icon: Icons.User, label: 'Profile', id: 'profile' },
          { icon: Icons.Key, label: 'API Keys', id: 'api-keys' },
          { icon: Icons.Users, label: 'Team', id: 'team' },
          { icon: Icons.CreditCard, label: 'Billing', id: 'billing' },
          { icon: Icons.Shield, label: 'Security', id: 'security' },
          { icon: Icons.Webhook, label: 'Webhooks', id: 'webhooks' },
          { icon: Icons.Key, label: 'Certificates', id: 'certificates' },
        ]
      : [
          { icon: Icons.LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
          { icon: Icons.CreditCard, label: 'Passes', id: 'passes' },
          { icon: Icons.Brain, label: 'Engage AI', id: 'engage' },
          { icon: Icons.BarChart3, label: 'Analytics', id: 'analytics' },
          { icon: Icons.Boxes, label: 'Integrations', id: 'integrations' },
        ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        onNavigate={handleNavigate}
        onSignOut={signOut}
      />

      {/* Sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-black transition-all duration-300 md:flex ${isSidebarCollapsed ? 'w-20' : 'w-[17rem]'}`}
      >
        <div className="absolute inset-0 p-3">
          <div className="h-full w-full rounded-[14px] bg-gradient-to-b from-[#0a1e28] via-[#081823] to-[#040911]" />
        </div>
        <div className="relative z-10 flex h-full flex-col">
          <div className="mt-1.5 flex h-16 items-center px-6">
            {!isSidebarCollapsed && (
              <div className="cursor-pointer pl-2" onClick={handleLogoClick}>
                <Logo className="h-[1.8rem] w-auto text-white" />
              </div>
            )}
            <button
              onClick={handleToggleSidebar}
              className={`ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-white ${isSidebarCollapsed ? 'pl-[7px]' : ''}`}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                <Icons.PanelLeftClose
                  className={`h-6 w-6 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                />
              </div>
            </button>
          </div>
          <nav className="mt-2 flex-1 space-y-1 px-4">
            {activeSection === 'settings' && !isSidebarCollapsed && (
              <div className="mb-4">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="ml-[-8px] flex h-9 w-full items-center rounded-lg px-3 text-sm text-white transition-colors hover:bg-gray-800 md:ml-0"
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <Icons.ArrowLeft className="h-6 w-6" />
                  </div>
                  <span className="ml-3.5 text-base font-medium">Main Menu</span>
                </button>
              </div>
            )}
            {activeSection === 'settings' && isSidebarCollapsed && (
              <Tooltip content="Back to Main Menu">
                <div className="mb-4">
                  <button
                    onClick={() => setActiveSection('dashboard')}
                    className="mx-auto flex h-10 w-full items-center justify-center rounded-lg text-sm text-white transition-colors hover:bg-gray-800"
                    style={{ width: '48px' }}
                  >
                    <Icons.ArrowLeft className="-ml-[2px] h-8 w-8" />
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
                      className={`flex h-10 w-full items-center justify-start rounded-lg px-3 text-[0.9rem] transition-colors ${
                        (
                          activeSection === 'settings'
                            ? activeSettingsSection === id
                            : activeSection === id
                        )
                          ? 'bg-gray-900/50 font-medium text-white'
                          : 'text-gray-400 hover:bg-gray-900/30 hover:text-white'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </button>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => handleNavigate(id)}
                    className={`flex h-10 w-full items-center justify-start rounded-lg px-3 text-base transition-colors ${
                      (
                        activeSection === 'settings'
                          ? activeSettingsSection === id
                          : activeSection === id
                      )
                        ? 'bg-gray-900/50 font-medium text-white'
                        : 'text-gray-400 hover:bg-gray-900/30 hover:text-white'
                    }`}
                  >
                    <div className="flex w-6 flex-shrink-0 items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="ml-3.5">{label}</span>
                    {id === 'integrations' && (
                      <span
                        className="ml-2 px-1.5 py-0.5 text-[9px] font-medium"
                        style={{ backgroundColor: '#8100fba3', borderRadius: '4px' }}
                      >
                        BETA
                      </span>
                    )}
                    {id === 'engage' && (
                      <span
                        className="ml-2 px-1.5 py-0.5 text-[9px] font-medium"
                        style={{ backgroundColor: '#8100fba3', borderRadius: '4px' }}
                      >
                        Coming Soon
                      </span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto px-3 py-6">
            <div className="space-y-1">
              {isSidebarCollapsed ? (
                <>
                  <Tooltip content="Forum">
                    <button
                      onClick={() => handleNavigate('forum')}
                      className="flex h-9 w-full items-center justify-center rounded-lg px-3 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                    >
                      <Icons.MessagesSquare className="h-6 w-6" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Help">
                    <button
                      onClick={() => handleNavigate('help')}
                      className="flex h-10 w-full items-center justify-center rounded-lg px-3 text-base text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                    >
                      <Icons.HelpCircle className="h-6 w-6" />
                    </button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate('forum')}
                    className="flex h-10 w-full items-center rounded-lg px-3 text-[0.9rem] text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                      <Icons.MessagesSquare className="h-6 w-6" />
                    </div>
                    <span className="ml-3.5">Forum</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('help')}
                    className="flex h-10 w-full items-center rounded-lg px-3 text-[0.9rem] text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                      <Icons.HelpCircle className="h-6 w-6" />
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
                  className="mt-4 flex h-10 w-full items-center justify-center rounded-lg px-4 text-base text-gray-400 transition-colors hover:bg-gray-800"
                >
                  <Icons.LogOut className="h-6 w-6" />
                </button>
              </Tooltip>
            ) : (
              <button
                onClick={() => signOut()}
                className="mt-4 flex h-10 w-full items-center rounded-lg px-4 text-[0.9rem] text-gray-400 transition-colors hover:bg-gray-800"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                  <Icons.LogOut className="h-6 w-6" />
                </div>
                <span className="ml-3.5">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1 overflow-x-hidden">
        <TopNav onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

        <main>
          {activeSection === 'dashboard' && children}
          {activeSection === 'passes' && (
            <div className="mx-auto max-w-7xl px-4 py-8">
              <h1 className="text-1xl mb-8 font-semibold tracking-tight">Passes</h1>
              <PassList />
            </div>
          )}
          {activeSection === 'engage' && (
            <div className="mx-auto max-w-7xl px-4 py-8">
              <h1 className="text-1xl mb-8 font-semibold tracking-tight">Engage AI</h1>
              <div className="rounded-lg bg-white p-6 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  Customer engagement features coming soon...
                </p>
              </div>
            </div>
          )}
          {activeSection === 'analytics' && (
            <div className="mx-auto max-w-7xl px-4 py-8">
              <h1 className="text-1xl mb-8 font-semibold tracking-tight">Analytics</h1>
              <AnalyticsOverview />
            </div>
          )}
          {activeSection === 'integrations' && (
            <div className="mx-auto max-w-7xl px-4 py-8">
              <h1 className="text-1xl mb-8 font-semibold tracking-tight">Integrations</h1>
              <IntegrationsOverview />
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="mx-auto max-w-7xl px-4 py-8">
              <h1 className="text-1xl mb-8 font-semibold tracking-tight">Settings</h1>
              <MerchantSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
