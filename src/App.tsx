import React, { useCallback, useEffect, useState } from 'react';
import { LiveActivityView } from './components/analytics/LiveActivityView';
import { AuthModal } from './components/auth/AuthModal';
import { AnalyticsCard } from './components/dashboard/AnalyticsCard';
import { LatestChanges } from './components/dashboard/LatestChanges';
import { WelcomeBanner } from './components/dashboard/WelcomeBanner';
import { Icons } from './components/icons';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PassCreationWizard } from './components/passes/PassCreationWizard';
import { useAnalytics } from './hooks/useAnalytics';
import { useAuth } from './hooks/useAuth';
import { useDatabase } from './hooks/useDatabase';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import type { PassTemplate } from './types/database';

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  useInactivityTimeout();

  useEffect(() => {
    if (!user && !loading) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <AuthModal onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="space-y-4 text-center">
        <Icons.CreditCard className="w-12 h-12 text-white mx-auto animate-pulse" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const [showPassWizard, setShowPassWizard] = useState(false);
  const { user } = useAuth();
  const { createPassTemplate, createPass } = useDatabase();
  const { data: analytics, loading: analyticsLoading } = useAnalytics(user?.id);

  const handleNavigate = useCallback((section: string) => {
    console.log(`Navigating to ${section}`);
    // Navigation logic will go here
  }, []);

  const handleCreatePass = useCallback(async (templateData: Omit<PassTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    console.log('Creating pass with template data:', templateData);
    try {
      // First create the pass template
      const template = await createPassTemplate({
        ...templateData,
        merchant_id: user.id,
        nfc_enabled: templateData.nfc_enabled || false
      });

      console.log('Created template:', template);

      if (template) {
        // Then create the pass instance
        const pass = await createPass({
          template_id: template.id,
          user_id: user.id,
          merchant_id: user.id,
          status: 'active'
        });
        console.log('Created pass:', pass);
      }

      setShowPassWizard(false);
    } catch (error) {
      console.error('Error creating pass:', error);
      throw error;
    }
  }, [user, createPassTemplate, createPass]);

  return (
    <AuthWrapper>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-1xl font-semibold tracking-tight">Home</h1>
            <button 
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center text-sm shadow-[0_0_1rem_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_1.5rem_0_rgba(0,0,0,0.3)]"
              onClick={() => setShowPassWizard(true)}
              disabled={!user}
            >
              <Icons.Plus className="w-4 h-4 mr-2" />
              <span className="font-medium">Create New Pass</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-black border border-gray-800 rounded-lg p-6">
              <WelcomeBanner />
            </div>
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <LatestChanges />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnalyticsCard
              title="Total Passes"
              value={analyticsLoading ? '...' : analytics?.totalPasses.toLocaleString() ?? '0'} 
              change="+12.5% from last month"
              icon={Icons.CreditCard}
              onClick={() => handleNavigate('passes')}
            />
            <AnalyticsCard
              title="Active Passes"
              value={analyticsLoading ? '...' : analytics?.activePasses.toLocaleString() ?? '0'}
              change="+8.2% from last month"
              icon={Icons.Wallet}
              onClick={() => handleNavigate('active-passes')}
            />
            <AnalyticsCard
              title="Scans Last Week"
              value={analyticsLoading ? '...' : analytics?.scansLastWeek.toLocaleString() ?? '0'}
              change="-2.3% from last week"
              positive={false}
              icon={Icons.TrendingUp}
              onClick={() => handleNavigate('scans')}
            />
            <AnalyticsCard
              title="Customer Engagement"
              value={analyticsLoading ? '...' : `${analytics?.customerEngagement ?? 0}%`}
              change="+5.2% from last month"
              icon={Icons.Users}
              onClick={() => handleNavigate('engagement')}
            />
          </div>

          <div className="mt-8 sm:mt-12">
            <LiveActivityView />
          </div>
          <div className="mt-24 pb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              <a href="/help" className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gray-900 rounded-lg mb-4 group-hover:bg-gray-800 transition-colors">
                    <Icons.HelpCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2 text-sm sm:text-base">Help center</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Frequently asked questions</p>
                </div>
              </a>
              <a href="/forum" className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gray-900 rounded-lg mb-4 group-hover:bg-gray-800 transition-colors">
                    <Icons.MessagesSquare className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2 text-sm sm:text-base">Developer forum</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Discuss with developers</p>
                </div>
              </a>
              <a href="/cookbook" className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gray-900 rounded-lg mb-4 group-hover:bg-gray-800 transition-colors">
                    <Icons.Book className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2 text-sm sm:text-base">Cookbook</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Examples and guides</p>
                </div>
              </a>
              <a href="/status" className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gray-900 rounded-lg mb-4 group-hover:bg-gray-800 transition-colors">
                    <Icons.Signal className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2 text-sm sm:text-base">Status</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Service status</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        {showPassWizard && (
          <PassCreationWizard
            onClose={() => setShowPassWizard(false)}
            onComplete={handleCreatePass}
          />
        )}
      </DashboardLayout>
    </AuthWrapper>
  );
}

export default App;