


import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { createMMKV, MMKV } from 'react-native-mmkv';
import { Order, TripStatus, ActiveTrip, PendingUpdate, HistoricalTrip, TripSyncStatus } from '../types';
import { updateTripStatus } from '../api/tripApi';


// Initialize MMKV
const storage = createMMKV();

// Custom MMKV adapter for Zustand persist
const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};



const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    pickupArea: 'Sector 18, Noida',
    dropArea: 'Sector 62, Noida',
    distanceKm: 6.4,
    payout: 58,
    itemCount: 3,
  },
  {
    id: 'ORD-1043',
    pickupArea: 'Lajpat Nagar, Delhi',
    dropArea: 'Saket, Delhi',
    distanceKm: 9.1,
    payout: 74,
    itemCount: 1,
  },
  {
    id: 'ORD-1044',
    pickupArea: 'Rohini, Delhi',
    dropArea: 'Pitampura, Delhi',
    distanceKm: 4.2,
    payout: 45,
    itemCount: 2,
  },
  {
    id: 'ORD-1045',
    pickupArea: 'Indiranagar, Bengaluru',
    dropArea: 'Koramangala, Bengaluru',
    distanceKm: 7.8,
    payout: 65,
    itemCount: 4,
  },
  {
    id: 'ORD-1046',
    pickupArea: 'Andheri West, Mumbai',
    dropArea: 'Bandra West, Mumbai',
    distanceKm: 11.3,
    payout: 95,
    itemCount: 2,
  },
  {
    id: 'ORD-1047',
    pickupArea: 'Salt Lake, Kolkata',
    dropArea: 'New Town, Kolkata',
    distanceKm: 5.5,
    payout: 50,
    itemCount: 1,
  },
  {
    id: 'ORD-1048',
    pickupArea: 'Gachibowli, Hyderabad',
    dropArea: 'Jubilee Hills, Hyderabad',
    distanceKm: 8.4,
    payout: 70,
    itemCount: 3,
  },
  {
    id: 'ORD-1049',
    pickupArea: 'Sector 15, Chandigarh',
    dropArea: 'Sector 35, Chandigarh',
    distanceKm: 3.6,
    payout: 40,
    itemCount: 5,
  },
  {
    id: 'ORD-1050',
    pickupArea: 'Hazratganj, Lucknow',
    dropArea: 'Gomti Nagar, Lucknow',
    distanceKm: 6.9,
    payout: 60,
    itemCount: 2,
  },
  {
    id: 'ORD-1051',
    pickupArea: 'T. Nagar, Chennai',
    dropArea: 'Adyar, Chennai',
    distanceKm: 7.2,
    payout: 62,
    itemCount: 1,
  },
  {
    id: 'ORD-1052',
    pickupArea: 'C-Scheme, Jaipur',
    dropArea: 'Malviya Nagar, Jaipur',
    distanceKm: 8.7,
    payout: 72,
    itemCount: 3,
  },
  {
    id: 'ORD-1053',
    pickupArea: 'Satellite, Ahmedabad',
    dropArea: 'Vastrapur, Ahmedabad',
    distanceKm: 3.1,
    payout: 35,
    itemCount: 4,
  },
];


interface TripState {
  availableOrders: Order[];
  activeTrip: ActiveTrip | null;
  history: HistoricalTrip[];
  pendingUpdate: PendingUpdate | null;
  isConnected: boolean;
  isRefreshingOrders: boolean;
  showSummaryModal: boolean;
  lastCompletedTrip: HistoricalTrip | null;

  
  // Actions
  setConnected: (isConnected: boolean) => void;
  refreshOrders: () => Promise<void>;
  acceptOrder: (orderId: string) => void;
  advanceTripStatus: () => Promise<void>;
  retrySync: () => Promise<void>;
  processPendingUpdate: () => Promise<void>;
  dismissSummaryModal: () => void;
  resetAll: () => void;


}

const getNextStatus = (currentStatus: TripStatus): TripStatus | null => {
  switch (currentStatus) {
    case 'ACCEPTED':
      return 'ARRIVED_AT_PICKUP';
    case 'ARRIVED_AT_PICKUP':
      return 'PICKED_UP';
    case 'PICKED_UP':
      return 'ARRIVED_AT_DROP';
    case 'ARRIVED_AT_DROP':
      return 'DELIVERED';
    default:
      return null;
  }
};