// NaHora Design System — Theme & Colors
export const Colors = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#8B85FF',
  secondary: '#1E1E2F',
  background: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Status colors
  success: '#2DD4BF',
  successLight: '#CCFBF1',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#6C63FF',
  infoLight: '#EDE9FF',

  // Text
  textPrimary: '#1E1E2F',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Border
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Gradient
  gradientStart: '#6C63FF',
  gradientEnd: '#8B5CF6',
  gradientDark: ['#6C63FF', '#8B5CF6'] as const,

  // Tab bar
  tabActive: '#6C63FF',
  tabInactive: '#94A3B8',

  // Card
  cardBackground: '#FFFFFF',
  cardShadow: 'rgba(108, 99, 255, 0.08)',

  // Overlay
  overlay: 'rgba(30, 30, 47, 0.5)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodyMd: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  label: { fontSize: 12, fontWeight: '500' as const, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
};
