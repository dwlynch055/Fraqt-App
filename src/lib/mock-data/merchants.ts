import type { Merchant } from '../../types/database';

export const mockMerchant: Merchant = {
  id: '1',
  name: 'Demo Merchant',
  email: 'demo@example.com',
  settings: {
    integrations: {},
    notifications: {
      passActivations: true,
      customerEngagement: true,
      systemUpdates: true
    },
    security: {
      twoFactor: true,
      apiKeyRotation: false,
      sessionManagement: true
    }
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};