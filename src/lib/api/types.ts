export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  merchant_id: string;
  status: string;
}

export interface Pass {
  id: string;
  template_id: string;
  user_id: string;
  merchant_id: string;
  status: string;
}

export interface Analytics {
  totalPasses: number;
  activePasses: number;
  scansLastWeek: number;
  customerEngagement: number;
}