import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTripStore } from '../store/useTripStore';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/theme';
import { HistoricalTrip } from '../types';

export const TripHistoryScreen = () => {
  const history = useTripStore((state) => state.history);

  // Calculate summary statistics
  const totalEarnings = history.reduce((sum, trip) => sum + trip.payout, 0);
  const totalDistance = history.reduce((sum, trip) => sum + trip.distanceKm, 0);
  const totalTrips = history.length;

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Completed';
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoricalTrip }) => {
    return (
      <View style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <Text style={styles.payout}>+₹{item.payout}</Text>
        </View>

        <View style={styles.routeContainer}>
          <Text style={styles.addressText}>
            🟢 {item.pickupArea}
          </Text>
          <View style={styles.routeLine} />
          <Text style={styles.addressText}>
            🔴 {item.dropArea}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerDetails}>
            📏 {item.distanceKm} km
          </Text>
          <Text style={styles.timestampText}>
            🕒 {formatDate(item.deliveredAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Stats Dashboard Dashboard */}
      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardTitle}>Lifetime Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{totalEarnings}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalTrips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalDistance.toFixed(1)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
        </View>
      </View>

      {/* History List Section */}
      <Text style={styles.sectionHeader}>Recent Deliveries</Text>

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📜</Text>
            <Text style={styles.emptyTitle}>No Completed Deliveries</Text>
            <Text style={styles.emptySubtitle}>
              Your delivery history will show up here after you successfully complete your active trips.
            </Text>
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
  dashboardCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    margin: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  dashboardTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 35,
    backgroundColor: COLORS.border,
  },
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  historyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  orderId: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  payout: {
    ...TYPOGRAPHY.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  routeContainer: {
    marginBottom: SPACING.md,
  },
  addressText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
  },
  routeLine: {
    width: 1,
    height: 10,
    backgroundColor: COLORS.border,
    marginLeft: 6,
    marginVertical: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  footerDetails: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  timestampText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: SPACING.xl,
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
    textAlign: 'center',
    lineHeight: 18,
  },
});