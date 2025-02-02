import type { ApiResponse, Member } from './types';

export const members = {
  list: async (): Promise<ApiResponse<Member[]>> => ({
    data: [],
    error: null,
  }),

  get: async (id: string): Promise<ApiResponse<Member>> => ({
    data: {
      id,
      name: 'Test User',
      email: 'test@example.com',
      merchant_id: '1',
      status: 'active',
    },
    error: null,
  }),

  create: async (data: Omit<Member, 'id'>): Promise<ApiResponse<Member>> => ({
    data: { id: '1', ...data },
    error: null,
  }),

  update: async (id: string, data: Partial<Member>): Promise<ApiResponse<Member>> => ({
    data: { id, ...data } as Member,
    error: null,
  }),

  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => ({
    data: { success: true },
    error: null,
  }),
};
