import {TripStatus} from "../types/trips.ts"

export const TRIP_STATES: TripStatus[] = [
  'ACCEPTED',
  'ARRIVED_AT_PICKUP',
  'PICKED_UP',
  'ARRIVED_AT_DROP',
  'DELIVERED',
];

export const NEXT_TRIP_STATUS: Record<
  TripStatus,
  TripStatus | null
> = {
  ACCEPTED: 'ARRIVED_AT_PICKUP',
  ARRIVED_AT_PICKUP: 'PICKED_UP',
  PICKED_UP: 'ARRIVED_AT_DROP',
  ARRIVED_AT_DROP: 'DELIVERED',
  DELIVERED: null,
};