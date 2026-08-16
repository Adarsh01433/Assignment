/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock react-native-mmkv for Jest
jest.mock('react-native-mmkv', () => {
  const store = new Map<string, string>();
  return {
    createMMKV: jest.fn(() => ({
      set: jest.fn((key, value) => {
        store.set(key, String(value));
      }),
      getString: jest.fn((key) => {
        return store.get(key) ?? null;
      }),
      remove: jest.fn((key) => {
        store.delete(key);
      }),
      clearAll: jest.fn(() => {
        store.clear();
      }),
    })),
  };
});

// Mock react-native-safe-area-context using official mock
jest.mock('react-native-safe-area-context', () => {
  return require('react-native-safe-area-context/jest/mock').default;
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

