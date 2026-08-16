import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const LOADING_STEPS = [
  'Initializing Zoop Driver Console...',
  'Syncing persistent trip state...',
  'Checking active delivery routes...',
  'Ready to launch!',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);

  useEffect(() => {
    // 1. Entrance animation for Logo
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous pulse animation for logo ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Progress bar animation over 2.4 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    // 4. Update loading message steps
    const t1 = setTimeout(() => setLoadingText(LOADING_STEPS[1]), 700);
    const t2 = setTimeout(() => setLoadingText(LOADING_STEPS[2]), 1400);
    const t3 = setTimeout(() => setLoadingText(LOADING_STEPS[3]), 2100);

    // 5. Fade out and complete splash
    const tFinish = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFinish);
    };
  }, [logoScale, logoOpacity, pulseAnim, progressAnim, screenFade, onFinish]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Main Logo Section */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.pulseRingOuter,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.boltIcon}>⚡</Text>
          </View>

          <Text style={styles.brandTitle}>ZOOP</Text>
          <Text style={styles.brandSubtitle}>LOGISTICS DRIVER CONSOLE</Text>
        </Animated.View>
      </View>

      {/* Footer Progress & Loading Indicator */}
      <View style={styles.footerContainer}>
        <Text style={styles.loadingText}>{loadingText}</Text>

        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>

        <View style={styles.footerBadge}>
          <Text style={styles.versionText}>POWERED BY ZOOP CORE • v1.0.0</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseRingOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 111, 0, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 111, 0, 0.3)',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: SPACING.lg,
    borderWidth: 3,
    borderColor: '#FFA726',
  },
  boltIcon: {
    fontSize: 48,
    color: COLORS.textOnPrimary,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 6,
    textShadowColor: 'rgba(255, 111, 0, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  brandSubtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.textSecondary,
    letterSpacing: 3,
    marginTop: SPACING.xs,
    fontWeight: '700',
  },
  footerContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  footerBadge: {
    marginTop: SPACING.lg,
  },
  versionText: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
});
