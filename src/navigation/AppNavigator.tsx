import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { AvailableOrdersScreen } from '../screens/AvailableOrdersScreen';
import { ActiveTripScreen } from '../screens/ActiveTripScreen';
import { TripHistoryScreen } from '../screens/TripHistoryScreen';
import { useTripStore } from '../store/useTripStore';

export type RootTabParamList = {
  AvailableOrders: undefined;
  ActiveTrip: undefined;
  TripHistory: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerFocused]}>
    <Text style={[styles.tabIcon, { opacity: focused ? 1.0 : 0.6 }]}>{emoji}</Text>
  </View>
);

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
    <NavigationContainer>
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
            tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="ActiveTrip"
          component={ActiveTripScreen}
          options={{
            title: 'Active Trip',
            tabBarLabel: 'Active Trip',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🚚" focused={focused} />,
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
            tabBarIcon: ({ focused }) => <TabIcon emoji="📜" focused={focused} />,
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
});
