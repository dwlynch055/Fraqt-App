export interface Analytics {
  totalPasses: number;
  activePasses: number;
  scansLastWeek: number;
  customerEngagement: number;
}

export interface PassTemplate {
  id: string;
  merchant_id: string;
  name: string;
  description: string;
  type: 'loyalty' | 'coupon' | 'ticket';
  style: {
    backgroundColor: string;
    foregroundColor: string;
    labelColor: string;
  };
  nfc_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pass {
  id: string;
  template_id: string;
  user_id: string;
  merchant_id: string;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface PassWithTemplate extends Pass {
  template: PassTemplate;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  settings: {
    integrations: Record<string, unknown>;
    notifications: Record<string, boolean>;
    security: Record<string, boolean>;
  };
  created_at: string;
  updated_at: string;
}
