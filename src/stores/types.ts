export interface Activity {
  id: string
  type: 'created' | 'used'
  passType: 'loyalty' | 'coupon' | 'ticket'
  location: string
  timestamp: Date
}

export interface NavigationState {
  activeSection: string
  activeSettingsSection: string
  isSidebarCollapsed: boolean
  setActiveSection: (section: string) => void
  setActiveSettingsSection: (section: string) => void
  toggleSidebar: () => void
}

export interface ActivityState {
  activities: Activity[]
  stats: {
    created: number
    used: number
  }
  addActivity: (activity: Activity) => void
}