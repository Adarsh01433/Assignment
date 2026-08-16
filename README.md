# Logistics Driver & Trip Management Mobile App (React Native)

A resilient, offline-first delivery driver application built with **React Native**, **Zustand**, and **MMKV storage**. The app is engineered specifically to handle real-world network reliability issues—such as failed status updates, transient network drops, and offline queueing—with graceful state recovery.

---

## 🚀 How to Run It

### Prerequisites
- Node.js (>= 18)
- React Native CLI environment setup (Android Studio / Xcode / CocoaPods for iOS)
- Android Emulator or iOS Simulator / Physical Device

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adarsh01433/Assignment.git
   cd Assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro Bundler:**
   ```bash
   npm start
   ```

5. **Run on Android / iOS:**
   - For Android:
     ```bash
     npm run android
     ```
   - For iOS:
     ```bash
     npm run ios
     ```

---

## 🛡️ Approach to Handling Failed Status Updates

In real-world logistics, drivers frequently transit through low-connectivity zones (elevators, basements, remote roads). A single status update failure should **never corrupt state** or **lose driver progress**.

### Key Architectural Concepts & Mechanics:

1. **Optimistic Locking & State Isolation (`syncStatus`)**:
   - Every trip status progression (`ACCEPTED` ➔ `ARRIVED_AT_PICKUP` ➔ `PICKED_UP` ➔ `ARRIVED_AT_DROP` ➔ `DELIVERED`) transitions through `syncStatus: 'pending'`.
   - Action buttons are immediately locked during network calls to prevent duplicate requests or race conditions.

2. **Pending Update Queue (`PendingUpdate`)**:
   - Before attempting any network request, the target state transition is recorded in persistent memory (`pendingUpdate`).
   - If the network call fails or times out (simulated 30% failure rate in `tripApi.ts`), the app updates `syncStatus` to `'failed'` and attaches the explicit error message.

3. **Offline Awareness & Resiliency**:
   - A toggle in the app header allows simulating **ONLINE / OFFLINE** network states.
   - When offline, attempts to advance status immediately queue the update and transition to a warm offline banner explaining that sync will automatically resume upon reconnect.
   - Re-establishing connection (`setConnected(true)`) automatically triggers `processPendingUpdate()` to attempt syncing without manual driver intervention.

4. **Manual Retry & Recovery Path**:
   - In case of network failure while online, an explicit **"Retry Sync"** button is rendered on the active trip screen allowing the driver to re-trigger the sync manually without re-entering data or losing trip progress.

5. **State Persistence with MMKV**:
   - App state is backed by `MMKV` via Zustand's `persist` middleware.
   - Even if the app crashes, is closed, or loses power during a `'failed'` or `'pending'` status sync, the exact pending state and failure context are rehydrated upon re-launch.

---

## 🔮 What I'd Do Differently or Add With More Time

1. **Exponential Backoff & Automatic Retry Mechanism**:
   - Implement an automated background retry queue (e.g., using exponential backoff strategy) so failed updates retry automatically 3-5 times before requiring user intervention.
2. **Idempotency Keys**:
   - Include unique UUID idempotency keys for each status transition request to ensure the backend never processes duplicate updates if network packets are re-sent.
3. **Interactive Maps & Geofencing**:
   - Integrate `react-native-maps` with geofence triggers to automatically prompt status updates (e.g., auto-detecting arrival within 50 meters of pickup/drop area).
4. **Comprehensive Test Suite**:
   - Add end-to-end integration tests using Detox / React Native Testing Library covering offline-to-online transitions and retry state flows.
5. **WebSocket / Real-Time Syncing**:
   - Implement WebSocket connections for live driver position tracking and instant server push notifications.

---

## 🐛 Known Bugs or Incomplete Parts

- **Simulated Connection Header**: Connection toggling is currently controlled via a top-right UI switch for quick testing and demonstration purposes rather than React Native NetInfo module listener.
- **Single Active Trip Limitation**: The app currently supports only 1 active trip per driver at a time (batching multiple pickups in one route is not yet supported).
- **Location Permissions & GPS**: Actual device GPS coordinates are simulated via pickup/drop address strings rather than native device location APIs.

---

## 🎥 60-Second Screen Recording Demonstration

### Video Walkthrough Highlights (What the clip demonstrates):
1. **Initiating Status Update**: Driver clicks on status progression (e.g., "Arrive at Pickup Location").
2. **Simulated Failure Handled**: The network call fails (simulated 30% error or offline toggle), displaying the **Red Sync Failed Banner** & setting `syncStatus` to `'failed'`.
3. **Graceful Recovery**: Driver taps **"Retry Sync"** (or toggles online), the request succeeds, state updates to the next step cleanly (`ARRIVED_AT_PICKUP`), and the driver continues seamlessly to delivery completion.

