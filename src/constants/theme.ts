export const COLORS = {
  // Brand Colors
  primary: '#FF6F00',     // Vibrant courier orange
  primaryLight: '#FFE0B2',
  primaryDark: '#E65100',
  accent: '#2979FF',      // Electric blue

  // Theme Neutrals (Dark Mode Focused)
  background: '#121212',
  surface: '#1E1E1E',
  surfaceLight: '#2C2C2C',
  border: '#383838',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#707070',
  textOnPrimary: '#FFFFFF',

  // Status/Feedback Colors
  success: '#10B981',     // Emerald green
  warning: '#F59E0B',     // Amber
  error: '#EF4444',       // Crimson red
  info: '#3B82F6',        // Blue
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    letterSpacing: 0.25,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    letterSpacing: 0.15,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    letterSpacing: 0.4,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 1.25,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: 10,
    fontWeight: 'normal' as const,
    letterSpacing: 1.5,
  },
};
