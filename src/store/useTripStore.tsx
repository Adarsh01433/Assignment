import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { Order, TripStatus, ActiveTrip, PendingUpdate, HistoricalTrip } from '../types';
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

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      availableOrders: INITIAL_ORDERS,
      activeTrip: null,
      history: [],
      pendingUpdate: null,
      isConnected: true,
      isRefreshingOrders: false,
      showSummaryModal: false,
      lastCompletedTrip: null,

      setConnected: (isConnected) => {
        const wasOffline = !get().isConnected;
        set({ isConnected });
        
        // If transitioning from offline to online, trigger pending sync
        if (wasOffline && isConnected && get().pendingUpdate) {
          get().processPendingUpdate();
        }
      },

      refreshOrders: async () => {
        set({ isRefreshingOrders: true });
        // Simulate network delay
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
        
        // Populate orders, filter out currently active trip if any
        const activeTrip = get().activeTrip;
        const activeOrderId = activeTrip?.order.id;
        
        const filteredInitial = INITIAL_ORDERS.filter(
          (o) => o.id !== activeOrderId
        );
        
        // If we want random new orders we can do that, or just reset the list
        set({
          availableOrders: filteredInitial,
          isRefreshingOrders: false,
        });
      },

      acceptOrder: (orderId) => {
        const { activeTrip, availableOrders } = get();
        if (activeTrip) {
          return; // Already has an active trip
        }

        const order = availableOrders.find((o) => o.id === orderId);
        if (!order) {
          return;
        }

        set({
          activeTrip: {
            order,
            status: 'ACCEPTED',
            syncStatus: 'idle',
          },
          availableOrders: availableOrders.filter((o) => o.id !== orderId),
        });
      },

      advanceTripStatus: async () => {
        const { activeTrip, pendingUpdate } = get();
        if (!activeTrip || activeTrip.syncStatus === 'pending' || pendingUpdate) {
          return; // Lock duplicate submits or invalid states
        }

        const nextStatus = getNextStatus(activeTrip.status);
        if (!nextStatus) {
          return;
        }

        // 1. Set state to pending and record pending update
        set({
          activeTrip: {
            ...activeTrip,
            syncStatus: 'pending',
            error: undefined,
          },
          pendingUpdate: {
            tripId: activeTrip.order.id,
            targetStatus: nextStatus,
            timestamp: Date.now(),
          },
        });

        // 2. Process
        await get().processPendingUpdate();
      },

      retrySync: async () => {
        const { activeTrip, pendingUpdate } = get();
        if (!activeTrip || activeTrip.syncStatus !== 'failed' || !pendingUpdate) {
          return;
        }

        set({
          activeTrip: {
            ...activeTrip,
            syncStatus: 'pending',
            error: undefined,
          },
        });

        await get().processPendingUpdate();
      },

      processPendingUpdate: async () => {
        const { pendingUpdate, activeTrip, isConnected } = get();
        if (!pendingUpdate || !activeTrip) {
          return;
        }

        // If offline, don't even call api, set to failed with network message
        if (!isConnected) {
          set({
            activeTrip: {
              ...activeTrip,
              syncStatus: 'failed',
              error: 'Offline: Status update will resume when connection is restored',
            },
          });
          return;
        }

        try {
          const result = await updateTripStatus(pendingUpdate.tripId, pendingUpdate.targetStatus);
          
          // Successful transition
          const currentActiveTrip = get().activeTrip;
          if (!currentActiveTrip) {
            return;
          }

          if (result.status === 'DELIVERED') {
            const completedTrip: HistoricalTrip = {
              id: `${result.tripId}-${result.syncedAt}`,
              orderId: currentActiveTrip.order.id,
              pickupArea: currentActiveTrip.order.pickupArea,
              dropArea: currentActiveTrip.order.dropArea,
              distanceKm: currentActiveTrip.order.distanceKm,
              payout: currentActiveTrip.order.payout,
              deliveredAt: result.syncedAt,
            };

            set({
              activeTrip: {
                ...currentActiveTrip,
                status: 'DELIVERED',
                syncStatus: 'idle',
              },
              history: [completedTrip, ...get().history],
              lastCompletedTrip: completedTrip,
              showSummaryModal: true,
              pendingUpdate: null,
            });
          } else {
            set({
              activeTrip: {
                ...currentActiveTrip,
                status: result.status,
                syncStatus: 'idle',
              },
              pendingUpdate: null,
            });
          }
        } catch (error: any) {
          // Handle error
          const currentActiveTrip = get().activeTrip;
          if (!currentActiveTrip) {
            return;
          }

          set({
            activeTrip: {
              ...currentActiveTrip,
              syncStatus: 'failed',
              error: error.message || 'Failed to update status',
            },
          });
        }
      },

      dismissSummaryModal: () => {
        set({
          activeTrip: null,
          lastCompletedTrip: null,
          showSummaryModal: false,
        });
      },

      resetAll: () => {
        set({
          availableOrders: INITIAL_ORDERS,
          activeTrip: null,
          history: [],
          pendingUpdate: null,
          showSummaryModal: false,
          lastCompletedTrip: null,
        });
      },
    }),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist core sync state and history. We exclude ephemeral UI/connection states.
      partialize: (state) => ({
        availableOrders: state.availableOrders,
        activeTrip: state.activeTrip,
        history: state.history,
        pendingUpdate: state.pendingUpdate,
        showSummaryModal: state.showSummaryModal,
        lastCompletedTrip: state.lastCompletedTrip,
      }),
    }
  )
);
