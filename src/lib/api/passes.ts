import type { ApiResponse, Pass } from './types';

export const passes = {
  list: async (): Promise<ApiResponse<Pass[]>> => ({
    data: [],
    error: null,
  }),

  get: async (id: string): Promise<ApiResponse<Pass>> => ({
    data: {
      id,
      template_id: '1',
      user_id: '1',
      merchant_id: '1',
      status: 'active',
    },
    error: null,
  }),

  create: async (data: Omit<Pass, 'id'>): Promise<ApiResponse<Pass>> => ({
    data: { id: '1', ...data },
    error: null,
  }),

  update: async (id: string, data: Partial<Pass>): Promise<ApiResponse<Pass>> => ({
    data: { id, ...data } as Pass,
    error: null,
  }),

  remove: async (id: string): Promise<ApiResponse<{ success: boolean }>> => ({
    data: { success: true },
    error: null,
  }),
};
