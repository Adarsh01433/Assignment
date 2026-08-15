export interface Order {
  id: string;
  pickupArea: string;
  dropArea: string;
  distanceKm: number;
  payout: number;
  itemCount: number;
}

export type TripStatus =
  | 'ACCEPTED'
  | 'ARRIVED_AT_PICKUP'
  | 'PICKED_UP'
  | 'ARRIVED_AT_DROP'
  | 'DELIVERED';

export type TripSyncStatus = 'idle' | 'pending' | 'failed';

export interface ActiveTrip {
  order: Order;
  status: TripStatus;
  syncStatus: TripSyncStatus;
  error?: string;
}

export interface PendingUpdate {
  tripId: string;
  targetStatus: TripStatus;
  timestamp: number;
}

export interface HistoricalTrip {
  id: string;
  orderId: string;
  pickupArea: string;
  dropArea: string;
  distanceKm: number;
  payout: number;
  deliveredAt: number;
}
