import { describe, it, expect } from 'vitest';
import { api } from '../lib/api';

describe('Members API', () => {
  it('should list members', async () => {
    const { data, error } = await api.members.list();
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should get a member', async () => {
    const { data, error } = await api.members.get('1');
    expect(error).toBeNull();
    expect(data).toHaveProperty('id', '1');
  });

  it('should create a member', async () => {
    const { data, error } = await api.members.create({
      name: 'Test User',
      email: 'test@example.com',
      merchant_id: '1',
      status: 'active',
    });
    expect(error).toBeNull();
    expect(data).toHaveProperty('id');
  });
});

describe('Analytics API', () => {
  it('should get analytics data', async () => {
    const { data, error } = await api.analytics.get();
    expect(error).toBeNull();
    expect(data).toHaveProperty('totalPasses');
    expect(data).toHaveProperty('activePasses');
    expect(data).toHaveProperty('scansLastWeek');
    expect(data).toHaveProperty('customerEngagement');
  });
});
