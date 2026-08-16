


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