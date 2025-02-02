import { create } from 'zustand';
import type { NavigationState } from './types';

export const useNavigationStore = create<NavigationState>()((set, get) => ({
  activeSection: 'dashboard',
  activeSettingsSection: 'profile',
  isSidebarCollapsed: false,
  setActiveSection: (section) => set({ activeSection: section }),
  setActiveSettingsSection: (section) => set({ activeSettingsSection: section }),
  toggleSidebar: () => {
    const newState = !get().isSidebarCollapsed;
    set({ isSidebarCollapsed: newState });
    return newState;
  },
  setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),
}));
