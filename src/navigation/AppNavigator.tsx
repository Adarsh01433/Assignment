import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AvailableOrdersScreen from '../screens/AvailableOrdersScreen';
import ActiveTripScreen from '../screens/ActiveTripScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import SplashScreen from '../screens/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (

   <NavigationContainer>
     <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />

      <Stack.Screen
        name="AvailableOrders"
        component={AvailableOrdersScreen}
        options={{
          title: 'Available Orders',
        }}
      />

      <Stack.Screen
        name="ActiveTrip"
        component={ActiveTripScreen}
        options={{
          title: 'Active Trip',
        }}
      />

      <Stack.Screen
        name="TripHistory"
        component={TripHistoryScreen}
        options={{
          title: 'Trip History',
        }}
      />
    </Stack.Navigator>
   </NavigationContainer>
  );
};

export default AppNavigator;
