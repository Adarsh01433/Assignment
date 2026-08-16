import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTripStore } from '../store/useTripStore';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/theme';
import { Order } from '../types';

export const AvailableOrdersScreen = () => {
  const navigation = useNavigation<any>();
  const availableOrders = useTripStore((state) => state.availableOrders);
  const activeTrip = useTripStore((state) => state.activeTrip);
  const isRefreshingOrders = useTripStore((state) => state.isRefreshingOrders);
  const refreshOrders = useTripStore((state) => state.refreshOrders);
  const acceptOrder = useTripStore((state) => state.acceptOrder);

  const handleAcceptOrder = (orderId: string) => {
    acceptOrder(orderId);
    navigation.navigate('ActiveTrip');
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const hasActiveTrip = !!activeTrip;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.payout}>₹{item.payout}</Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>📏 {item.distanceKm} km</Text>
          <Text style={styles.statDot}>•</Text>
          <Text style={styles.statLabel}>📦 {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeNode}>
            <Text style={styles.routeIndicatorDotGreen}>🟢</Text>
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>PICKUP</Text>
              <Text style={styles.routeAddress}>{item.pickupArea}</Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routeNode}>
            <Text style={styles.routeIndicatorDotRed}>🔴</Text>
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>DROP</Text>
              <Text style={styles.routeAddress}>{item.dropArea}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.acceptButton, hasActiveTrip && styles.disabledButton]}
          onPress={() => handleAcceptOrder(item.id)}
          disabled={hasActiveTrip}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptButtonText}>
            {hasActiveTrip ? 'Active Trip in Progress' : 'Accept Order'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {activeTrip && (
        <TouchableOpacity
          style={styles.banner}
          onPress={() => navigation.navigate('ActiveTrip')}
          activeOpacity={0.9}
        >
          <Text style={styles.bannerText}>
            🚚 Active trip in progress. Tap here to view status.
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={availableOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshingOrders}
        onRefresh={refreshOrders}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No Orders Available</Text>
            <Text style={styles.emptySubtitle}>
              Pull down to refresh or check back later.
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={refreshOrders}
              disabled={isRefreshingOrders}
            >
              {isRefreshingOrders ? (
                <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
              ) : (
                <Text style={styles.refreshButtonText}>Refresh List</Text>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  banner: {
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#000000',
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderId: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  payout: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  statDot: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textMuted,
  },
  routeContainer: {
    marginBottom: SPACING.lg,
  },
  routeNode: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIndicatorDotGreen: {
    fontSize: 12,
    marginTop: 2,
    marginRight: SPACING.md,
  },
  routeIndicatorDotRed: {
    fontSize: 12,
    marginTop: 2,
    marginRight: SPACING.md,
  },
  routeDetails: {
    flex: 1,
  },
  routeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: 'bold',
  },
  routeAddress: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  routeLine: {
    width: 1,
    height: SPACING.lg,
    backgroundColor: COLORS.border,
    marginLeft: 6,
    marginVertical: 2,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  acceptButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textOnPrimary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyEmoji: {
    fontSize: 64,
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
  refreshButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  refreshButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textOnPrimary,
  },
});