import { TripStatus } from '../types';

export function updateTripStatus(
  tripId: string,
  status: TripStatus
): Promise<{ tripId: string; status: TripStatus; syncedAt: number }> {
  return new Promise((resolve, reject) => {
    const delay = 2000 + Math.random() * 2000; // 2-4 seconds
    setTimeout(() => {
      if (Math.random() < 0.3) {
        // fails 30% of the time
        reject(new Error('Network request failed'));
      } else {
        resolve({ tripId, status, syncedAt: Date.now() });
      }
    }, delay);
  });
}
