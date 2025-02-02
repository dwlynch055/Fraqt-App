// Mock flights API implementation
export async function listFlights() {
  return [];
}

export async function getFlight(id: string) {
  return null;
}

export async function createFlight(flight: any) {
  return { id: '1', ...flight };
}

export async function updateFlight(id: string, updates: any) {
  return { id, ...updates };
}

export async function deleteFlight(id: string) {
  return { success: true };
}

// Boarding Passes
export async function issueBoardingPass(flightId: string, userId: string, seatNumber: string) {
  return {
    id: '1',
    flight_id: flightId,
    user_id: userId,
    seat_number: seatNumber,
    status: 'active',
  };
}

export async function getBoardingPass(id: string) {
  return null;
}

export async function updateBoardingPass(id: string, updates: any) {
  return { id, ...updates };
}

export async function revokeBoardingPass(id: string) {
  return { success: true };
}
