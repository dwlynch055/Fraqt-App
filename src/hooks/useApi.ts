import { useState, useCallback } from 'react';
import { api } from '../lib/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
        delete: (id: string) => execute(() => api.members.deleteMember(id)),
        issueCard: (templateId: string, memberId: string) => 
          execute(() => api.members.issueCard(templateId, memberId)),
        getCard: (id: string) => execute(() => api.members.getCard(id)),
        updateCard: (id: string, data: any) => execute(() => api.members.updateCard(id, data)),
        voidCard: (id: string) => execute(() => api.members.voidCard(id))
      },
      coupons: {
        list: () => execute(() => api.coupons.listCoupons()),
        get: (id: string) => execute(() => api.coupons.getCoupon(id)),
        create: (data: any) => execute(() => api.coupons.createCoupon(data)),
        update: (id: string, data: any) => execute(() => api.coupons.updateCoupon(id, data)),
        delete: (id: string) => execute(() => api.coupons.deleteCoupon(id)),
        redeem: (id: string) => execute(() => api.coupons.redeemCoupon(id)),
        campaigns: {
          list: () => execute(() => api.coupons.listCampaigns()),
          get: (id: string) => execute(() => api.coupons.getCampaign(id)),
          create: (data: any) => execute(() => api.coupons.createCampaign(data)),
          update: (id: string, data: any) => execute(() => api.coupons.updateCampaign(id, data)),
          delete: (id: string) => execute(() => api.coupons.deleteCampaign(id))
        }
      },
      events: {
        list: () => execute(() => api.events.listEvents()),
        get: (id: string) => execute(() => api.events.getEvent(id)),
        create: (data: any) => execute(() => api.events.createEvent(data)),
        update: (id: string, data: any) => execute(() => api.events.updateEvent(id, data)),
        delete: (id: string) => execute(() => api.events.deleteEvent(id)),
        tickets: {
          issue: (eventId: string, userId: string) => 
            execute(() => api.events.issueTicket(eventId, userId)),
          get: (id: string) => execute(() => api.events.getTicket(id)),
          update: (id: string, data: any) => execute(() => api.events.updateTicket(id, data)),
          revoke: (id: string) => execute(() => api.events.revokeTicket(id))
        }
      },
      flights: {
        list: () => execute(() => api.flights.listFlights()),
        get: (id: string) => execute(() => api.flights.getFlight(id)),
        create: (data: any) => execute(() => api.flights.createFlight(data)),
        update: (id: string, data: any) => execute(() => api.flights.updateFlight(id, data)),
        delete: (id: string) => execute(() => api.flights.deleteFlight(id)),
        boardingPasses: {
          issue: (flightId: string, userId: string, seatNumber: string) => 
            execute(() => api.flights.issueBoardingPass(flightId, userId, seatNumber)),
          get: (id: string) => execute(() => api.flights.getBoardingPass(id)),
          update: (id: string, data: any) => execute(() => api.flights.updateBoardingPass(id, data)),
          revoke: (id: string) => execute(() => api.flights.revokeBoardingPass(id))
        }
      },
      templates: {
        list: () => execute(() => api.templates.listTemplates()),
        get: (id: string) => execute(() => api.templates.getTemplate(id)),
        create: (data: any) => execute(() => api.templates.createTemplate(data)),
        update: (id: string, data: any) => execute(() => api.templates.updateTemplate(id, data)),
        delete: (id: string) => execute(() => api.templates.deleteTemplate(id)),
        fields: {
          list: (templateId: string) => execute(() => api.templates.listCustomFields(templateId)),
          get: (id: string) => execute(() => api.templates.getCustomField(id)),
          create: (data: any) => execute(() => api.templates.createCustomField(data)),
          update: (id: string, data: any) => execute(() => api.templates.updateCustomField(id, data)),
          delete: (id: string) => execute(() => api.templates.deleteCustomField(id))
        }
      },
      locations: {
        list: () => execute(() => api.locations.listLocations()),
        get: (id: string) => execute(() => api.locations.getLocation(id)),
        create: (data: any) => execute(() => api.locations.createLocation(data)),
        update: (id: string, data: any) => execute(() => api.locations.updateLocation(id, data)),
        delete: (id: string) => execute(() => api.locations.deleteLocation(id))
      },
      beacons: {
        list: () => execute(() => api.locations.listBeacons()),
        get: (id: string) => execute(() => api.locations.getBeacon(id)),
        create: (data: any) => execute(() => api.locations.createBeacon(data)),
        update: (id: string, data: any) => execute(() => api.locations.updateBeacon(id, data)),
        delete: (id: string) => execute(() => api.locations.deleteBeacon(id))
      },
      analytics: {
        get: (merchantId: string, startDate: string, endDate: string) => 
    api
  };
}