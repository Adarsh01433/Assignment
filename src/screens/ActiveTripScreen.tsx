import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTripStore } from '../store/useTripStore';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/theme';
import { TripStatus } from '../types';

const STATUS_STEPS: { status: TripStatus; label: string; desc: string; emoji: string }[] = [
  { status: 'ACCEPTED', label: 'Accepted', desc: 'Order assigned to you', emoji: '🤝' },
  { status: 'ARRIVED_AT_PICKUP', label: 'Arrived at Pickup', desc: 'Reached store location', emoji: '📍' },
  { status: 'PICKED_UP', label: 'Picked Up', desc: 'Items collected, in transit', emoji: '🎒' },
  { status: 'ARRIVED_AT_DROP', label: 'Arrived at Drop', desc: 'Reached customer location', emoji: '🏠' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Order handoff completed', emoji: '✅' },
];

export const ActiveTripScreen = () => {
  const navigation = useNavigation<any>();
  const activeTrip = useTripStore((state) => state.activeTrip);
  const isConnected = useTripStore((state) => state.isConnected);
  const advanceTripStatus = useTripStore((state) => state.advanceTripStatus);
  const retrySync = useTripStore((state) => state.retrySync);
  
  // Modal states
  const showSummaryModal = useTripStore((state) => state.showSummaryModal);
  const lastCompletedTrip = useTripStore((state) => state.lastCompletedTrip);
  const dismissSummaryModal = useTripStore((state) => state.dismissSummaryModal);

  if (!activeTrip && !showSummaryModal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🚚</Text>
          <Text style={styles.emptyTitle}>No Active Delivery</Text>
          <Text style={styles.emptySubtitle}>
            Go to the orders pool to browse and accept an order.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AvailableOrders')}
          >
            <Text style={styles.actionButtonText}>View Available Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Determine button text based on status
  const getButtonText = (status: TripStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return 'Arrive at Pickup Location';
      case 'ARRIVED_AT_PICKUP':
        return 'Pick Up Items';
      case 'PICKED_UP':
        return 'Arrived at Drop Location';
      case 'ARRIVED_AT_DROP':
        return 'Complete Delivery';
      case 'DELIVERED':
        return 'Delivered';
      default:
        return 'Advance Status';
    }
  };

  const getStatusIndex = (currentStatus: TripStatus) => {
    return STATUS_STEPS.findIndex((s) => s.status === currentStatus);
  };

  const currentStatusIndex = activeTrip ? getStatusIndex(activeTrip.status) : 4;
  const syncStatus = activeTrip?.syncStatus;
  const isPending = syncStatus === 'pending';
  const isFailed = syncStatus === 'failed';

  return (
    <SafeAreaView style={styles.container}>
      {activeTrip && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Status/Offline banner messages */}
          {isFailed && (
            <View style={[styles.errorBanner, !isConnected && styles.offlineBanner]}>
              <Text style={styles.errorText}>
                {!isConnected
                  ? '⚠️ Offline: Local progress saved. Syncing will resume once you are back online.'
                  : `❌ Sync Failed: ${activeTrip.error || 'Network error'}`}
              </Text>
              {isConnected && (
                <TouchableOpacity style={styles.retryButton} onPress={retrySync}>
                  <Text style={styles.retryButtonText}>Retry Sync</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Active order info card */}
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>{activeTrip.order.id}</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Active</Text>
              </View>
            </View>

            <View style={styles.routeContainer}>
              <View style={styles.routeNode}>
                <Text style={styles.nodeIcon}>🟢</Text>
                <View style={styles.nodeDetails}>
                  <Text style={styles.nodeLabel}>PICKUP FROM</Text>
                  <Text style={styles.nodeAddress}>{activeTrip.order.pickupArea}</Text>
                </View>
              </View>

              <View style={styles.routeLine} />

              <View style={styles.routeNode}>
                <Text style={styles.nodeIcon}>🔴</Text>
                <View style={styles.nodeDetails}>
                  <Text style={styles.nodeLabel}>DELIVER TO</Text>
                  <Text style={styles.nodeAddress}>{activeTrip.order.dropArea}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>₹{activeTrip.order.payout}</Text>
                <Text style={styles.summaryLabel}>Payout</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{activeTrip.order.distanceKm} km</Text>
                <Text style={styles.summaryLabel}>Distance</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{activeTrip.order.itemCount}</Text>
                <Text style={styles.summaryLabel}>Items</Text>
              </View>
            </View>
          </View>

          {/* Stepper Progress */}
          <Text style={styles.sectionTitle}>Delivery Checklist</Text>
          <View style={styles.stepperCard}>
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStatusIndex;
              const isActive = idx === currentStatusIndex;
              const isFuture = idx > currentStatusIndex;

              return (
                <View key={step.status} style={styles.stepContainer}>
                  <View style={styles.stepIndicatorCol}>
                    <View
                      style={[
                        styles.stepIndicatorCircle,
                        isCompleted && styles.circleCompleted,
                        isActive && styles.circleActive,
                        isFuture && styles.circleFuture,
                      ]}
                    >
                      <Text style={styles.stepEmoji}>{step.emoji}</Text>
                    </View>
                    {idx < STATUS_STEPS.length - 1 && (
                      <View
                        style={[
                          styles.stepIndicatorLine,
                          idx < currentStatusIndex ? styles.lineCompleted : styles.lineFuture,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepContentCol}>
                    <Text
                      style={[
                        styles.stepLabelText,
                        isActive && styles.stepLabelActive,
                        isCompleted && styles.stepLabelCompleted,
                      ]}
                    >
                      {step.label}
                    </Text>
                    <Text style={styles.stepDescText}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Persistent bottom advance button */}
      {activeTrip && (
        <View style={styles.buttonFooter}>
          <TouchableOpacity
            style={[
              styles.advanceButton,
              isPending && styles.buttonPending,
              isFailed && styles.buttonFailed,
            ]}
            onPress={advanceTripStatus}
            disabled={isPending || isFailed}
            activeOpacity={0.8}
          >
            {isPending ? (
              <View style={styles.row}>
                <ActivityIndicator color={COLORS.textOnPrimary} style={styles.spinnerMargin} />
                <Text style={styles.advanceButtonText}>Syncing status...</Text>
              </View>
            ) : (
              <Text style={styles.advanceButtonText}>
                {getButtonText(activeTrip.status)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Completion Summary Modal */}
      <Modal
        visible={showSummaryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={dismissSummaryModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Delivery Successful!</Text>
            <Text style={styles.modalSubtitle}>
              Great job! Your earnings have been credited to your wallet.
            </Text>

            {lastCompletedTrip && (
              <View style={styles.modalStatsCard}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>₹{lastCompletedTrip.payout}</Text>
                  <Text style={styles.modalStatLabel}>Total Payout</Text>
                </View>

                <View style={styles.modalStatDivider} />

                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>{lastCompletedTrip.distanceKm} km</Text>
                  <Text style={styles.modalStatLabel}>Distance</Text>
                </View>

                <View style={styles.modalStatDivider} />

                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>{lastCompletedTrip.orderId}</Text>
                  <Text style={styles.modalStatLabel}>Order ID</Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.modalCloseButton} onPress={dismissSummaryModal}>
              <Text style={styles.modalCloseButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 100, // Safe space for bottom button
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: 100,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  actionButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textOnPrimary,
  },
  errorBanner: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offlineBanner: {
    backgroundColor: COLORS.warning,
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: '#000000',
    fontWeight: 'bold',
    flex: 1,
    marginRight: SPACING.sm,
  },
  retryButton: {
    backgroundColor: '#000000',
    borderRadius: BORDER_RADIUS.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  retryButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  orderId: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 111, 0, 0.15)',
    borderRadius: BORDER_RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  routeContainer: {
    marginBottom: SPACING.md,
  },
  routeNode: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nodeIcon: {
    fontSize: 14,
    marginTop: 2,
    marginRight: SPACING.md,
  },
  nodeDetails: {
    flex: 1,
  },
  nodeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: 'bold',
  },
  nodeAddress: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  routeLine: {
    width: 1,
    height: SPACING.md,
    backgroundColor: COLORS.border,
    marginLeft: 6,
    marginVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  summaryLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginVertical: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  stepperCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicatorCol: {
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  stepIndicatorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  circleCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: COLORS.success,
  },
  circleActive: {
    backgroundColor: 'rgba(255, 111, 0, 0.1)',
    borderColor: COLORS.primary,
  },
  circleFuture: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  stepEmoji: {
    fontSize: 14,
  },
  stepIndicatorLine: {
    width: 2,
    height: 32,
  },
  lineCompleted: {
    backgroundColor: COLORS.success,
  },
  lineFuture: {
    backgroundColor: COLORS.border,
  },
  stepContentCol: {
    flex: 1,
    paddingBottom: 24,
  },
  stepLabelText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  stepLabelCompleted: {
    color: COLORS.success,
  },
  stepDescText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  buttonFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.md,
  },
  advanceButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPending: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  buttonFailed: {
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.6,
  },
  advanceButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textOnPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  modalStatsCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  modalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalStatValue: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  modalStatLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  modalStatDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  modalCloseButton: {
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.md,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textOnPrimary,
  },
  spinnerMargin: {
    marginRight: 8,
  },
});