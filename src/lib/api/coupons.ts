// Mock coupons API implementation
export async function listCoupons() {
  return [];
}

export async function getCoupon(id: string) {
  return null;
}

export async function createCoupon(coupon: any) {
  return { id: '1', ...coupon };
}

export async function updateCoupon(id: string, updates: any) {
  return { id, ...updates };
}

export async function deleteCoupon(id: string) {
  return { success: true };
}

export async function redeemCoupon(id: string) {
  return { success: true };
}

// Campaigns
export async function listCampaigns() {
  return [];
}

export async function getCampaign(id: string) {
  return null;
}

export async function createCampaign(campaign: any) {
  return { id: '1', ...campaign };
}

export async function updateCampaign(id: string, updates: any) {
  return { id, ...updates };
}

export async function deleteCampaign(id: string) {
  return { success: true };
}