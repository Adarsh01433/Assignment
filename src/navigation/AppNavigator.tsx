import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { AvailableOrdersScreen } from '../screens/AvailableOrdersScreen';
import { ActiveTripScreen } from '../screens/ActiveTripScreen';
import { TripHistoryScreen } from '../screens/TripHistoryScreen';
import { useTripStore } from '../store/useTripStore';
import { navigationRef } from '../utils/NavigationUtils';

export type RootTabParamList = {
  AvailableOrders: undefined;
  ActiveTrip: undefined;
  TripHistory: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerFocused]}>
    <Text style={[styles.tabIcon, focused ? styles.tabIconFocused : styles.tabIconUnfocused]}>{emoji}</Text>
  </View>
);

const HeaderRight = () => {
  const isConnected = useTripStore((state) => state.isConnected);
  const setConnected = useTripStore((state) => state.setConnected);
  return (
    <View style={styles.headerRightContainer}>
      <Text style={[styles.connectionText, { color: isConnected ? COLORS.success : COLORS.error }]}>
        {isConnected ? 'ONLINE' : 'OFFLINE'}
      </Text>
      <Switch
        value={isConnected}
        onValueChange={setConnected}
        trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
        thumbColor={isConnected ? COLORS.primary : COLORS.textMuted}
        ios_backgroundColor={COLORS.border}
        style={styles.switchTransform}
      />
    </View>
  );
};

const renderAvailableOrdersIcon = ({ focused }: { focused: boolean }) => <TabIcon emoji="📋" focused={focused} />;
const renderActiveTripIcon = ({ focused }: { focused: boolean }) => <TabIcon emoji="🚚" focused={focused} />;
const renderTripHistoryIcon = ({ focused }: { focused: boolean }) => <TabIcon emoji="📜" focused={focused} />;

export const AppNavigator = () => {
  const activeTrip = useTripStore((state) => state.activeTrip);
  const syncStatus = activeTrip?.syncStatus;

  // Show a badge on active trip tab if there's a trip
  const getActiveTripBadge = () => {
    if (!activeTrip) {
      return undefined;
    }
    if (syncStatus === 'pending') {
      return '⏳';
    }
    if (syncStatus === 'failed') {
      return '⚠️';
    }
    return '1';
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            ...TYPOGRAPHY.h2,
            color: COLORS.textPrimary,
          },
          headerRight: HeaderRight,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarLabelStyle: {
            ...TYPOGRAPHY.caption,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="AvailableOrders"
          component={AvailableOrdersScreen}
          options={{
            title: 'Available Orders',
            tabBarLabel: 'Orders',
            tabBarIcon: renderAvailableOrdersIcon,
          }}
        />
        <Tab.Screen
          name="ActiveTrip"
          component={ActiveTripScreen}
          options={{
            title: 'Active Trip',
            tabBarLabel: 'Active Trip',
            tabBarIcon: renderActiveTripIcon,
            tabBarBadge: getActiveTripBadge(),
            tabBarBadgeStyle: {
              backgroundColor: syncStatus === 'failed' ? COLORS.error : (syncStatus === 'pending' ? COLORS.info : COLORS.primary),
              color: COLORS.textOnPrimary,
              fontSize: 10,
              fontWeight: 'bold',
            },
          }}
        />
        <Tab.Screen
          name="TripHistory"
          component={TripHistoryScreen}
          options={{
            title: 'Trip History',
            tabBarLabel: 'History',
            tabBarIcon: renderTripHistoryIcon,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: 28,
    height: 28,
  },
  tabIconContainerFocused: {
    backgroundColor: 'rgba(255, 111, 0, 0.1)',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabIconFocused: {
    opacity: 1.0,
  },
  tabIconUnfocused: {
    opacity: 0.6,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  connectionText: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    marginRight: 6,
  },
  switchTransform: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
});

