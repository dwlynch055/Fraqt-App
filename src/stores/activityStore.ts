import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityState, Activity } from './types';

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      stats: {
        created: 0,
        used: 0,
      },
      addActivity: (activity: Activity) =>
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
