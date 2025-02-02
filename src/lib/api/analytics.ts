import type { ApiResponse, Analytics } from './types';

export const analytics = {
  get: async (): Promise<ApiResponse<Analytics>> => ({
    data: {
      totalPasses: 1234,
      activePasses: 987,
      scansLastWeek: 456,
      customerEngagement: 78,
    },
    error: null,
  }),
};
