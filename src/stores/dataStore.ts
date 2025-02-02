import { create } from 'zustand';
import type { Analytics } from '../types/database';
import type { ApiKey } from '../hooks/useApiKeys';

interface DataState {
  analytics: Analytics | null;
  members: any[];
  invitations: any[];
  apiKeys: ApiKey[] | null;
  setAnalytics: (data: Analytics) => void;
  setTeamData: (members: any[], invitations: any[]) => void;
  setApiKeys: (keys: ApiKey[]) => void;
}

export const useDataStore = create<DataState>((set) => ({
  analytics: null,
  members: [],
  invitations: [],
  apiKeys: null,
  setAnalytics: (data) => set({ analytics: data }),
  setTeamData: (members, invitations) => set({ members, invitations }),
  setApiKeys: (apiKeys) => set({ apiKeys })
}));