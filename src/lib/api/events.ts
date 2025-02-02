// Mock events API implementation
export async function listEvents() {
  return [];
}

export async function getEvent(id: string) {
  return null;
}

export async function createEvent(event: any) {
  return { id: '1', ...event };
}

export async function updateEvent(id: string, updates: any) {
  return { id, ...updates };
}

export async function deleteEvent(id: string) {
  return { success: true };
}

// Tickets
export async function issueTicket(eventId: string, userId: string) {
  return {
    id: '1',
    event_id: eventId,
    user_id: userId,
    status: 'active',
  };
}

export async function getTicket(id: string) {
  return null;
}

export async function updateTicket(id: string, updates: any) {
  return { id, ...updates };
}

export async function revokeTicket(id: string) {
  return { success: true };
}
