import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store types
interface NavigationState {
  activeSection: string;
  activeSettingsSection: string;
  setActiveSection: (section: string) => void;
  setActiveSettingsSection: (section: string) => void;
}

interface ActivityState {
  activities: Activity[];
  stats: {
    created: number;
    used: number;
  };
  addActivity: (activity: Activity) => void;
}

interface Activity {
  id: string;
  type: 'created' | 'used';
  passType: 'loyalty' | 'coupon' | 'ticket';
  location: string;
  timestamp: Date;
}

// Create stores
export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'dashboard',
  activeSettingsSection: 'profile',
  setActiveSection: (section) => set({ activeSection: section }),
  setActiveSettingsSection: (section) => set({ activeSettingsSection: section }),
}));

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      stats: {
        created: 0,
        used: 0,
      },
      addActivity: (activity) =>
        set((state) => ({
          activities: [activity, ...state.activities].slice(0, 8),
          stats: {
            ...state.stats,
            [activity.type]: state.stats[activity.type] + 1,
          },
        })),
    }),
    {
      name: 'activity-storage',
    }
  )
);
