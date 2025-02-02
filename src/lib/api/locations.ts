// Mock locations API implementation
export async function listLocations() {
  return [];
}

export async function getLocation(id: string) {
  return null;
}

export async function createLocation(location: any) {
  return { id: '1', ...location };
}

export async function updateLocation(id: string, updates: any) {
  return { id, ...updates };
}

export async function deleteLocation(id: string) {
  return { success: true };
}

// Beacons
export async function listBeacons() {
  return [];
}

export async function getBeacon(id: string) {
  return null;
}

export async function createBeacon(beacon: any) {
  return { id: '1', ...beacon };
}

export async function updateBeacon(id: string, updates: any) {
  return { id, ...updates };
}

export async function deleteBeacon(id: string) {
  return { success: true };
}