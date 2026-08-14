import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

type Props = {
  navigation: any;
};

const SplashScreen = ({navigation}: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('AvailableOrders');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>ZOOP</Text>
        <Text style={styles.tagline}>Delivery Partner</Text>
      </View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Getting things ready...</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
  },

  logo: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 1,
  },

  tagline: {
    marginTop: 6,
    fontSize: 15,
  },

  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
  },
});