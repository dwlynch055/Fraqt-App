import type { PassWithTemplate } from '../../types/database';

export const mockPasses: PassWithTemplate[] = [
  {
    id: '1',
    template_id: '1',
    user_id: '1',
    merchant_id: '1',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    template: {
      id: '1',
      merchant_id: '1',
      name: 'Gold Membership',
      description: 'Premium loyalty program membership',
      type: 'loyalty',
      style: {
        backgroundColor: '#1e40af',
        foregroundColor: '#ffffff',
        labelColor: '#93c5fd'
      },
      nfc_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: '2',
    template_id: '2',
    user_id: '1',
    merchant_id: '1',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    template: {
      id: '2',
      merchant_id: '1',
      name: 'Summer Sale',
      description: '25% off all purchases',
      type: 'coupon',
      style: {
        backgroundColor: '#047857',
        foregroundColor: '#ffffff',
        labelColor: '#6ee7b7'
      },
      nfc_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];