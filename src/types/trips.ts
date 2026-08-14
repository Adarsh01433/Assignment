export type Order = {
  id: string;
  pickupArea: string;
  dropArea: string;
  distanceKm: number;
  payout: number;
  itemCount: number;
};

export type TripStatus =
  | 'ACCEPTED'
  | 'ARRIVED_AT_PICKUP'
  | 'PICKED_UP'
  | 'ARRIVED_AT_DROP'
  | 'DELIVERED';

export type Trip = {
  order: Order;
  status: TripStatus;
};

export type UpdateState =
  | 'PENDING'
  | 'FAILED';

export type PendingUpdate = {
  tripId: string;
  nextStatus: TripStatus;
  state: UpdateState;
};