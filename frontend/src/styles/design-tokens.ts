/**
 * Design System Tokens
 * Billim - Real Estate Maintenance Platform
 * Version: 1.0.0
 */

export const designTokens = {
  name: 'Billim Design System',
  version: '1.0.0',
} as const;

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Color (Trust/Work) - Blue-600
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Secondary Color (Info) - Blue-500
  secondary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // CTA Color (Action) - Orange-500
  cta: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Status Colors
  status: {
    new: '#3B82F6', // Blue - 접수
    inProgress: '#F59E0B', // Amber - 진행중
    completed: '#10B981', // Green - 완료
    cancelled: '#EF4444', // Red - 취소
  },

  // Priority Colors
  priority: {
    low: '#10B981', // Green
    medium: '#F59E0B', // Amber
    high: '#EF4444', // Red
  },

  // Neutral Colors
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Named Colors
  background: '#F8FAFC', // Slate-50
  textPrimary: '#1E293B', // Slate-900
  textSecondary: '#64748B', // Slate-500
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Josefin Sans', sans-serif",
  },

  // Font Sizes & Weights
  sizes: {
    display: {
      fontSize: '48px',
      lineHeight: '1.2',
      fontWeight: 700 as const,
      letterSpacing: '-0.02em',
    },
    h1: {
      fontSize: '36px',
      lineHeight: '1.3',
      fontWeight: 600 as const,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '28px',
      lineHeight: '1.35',
      fontWeight: 600 as const,
      letterSpacing: '-0.005em',
    },
    h3: {
      fontSize: '24px',
      lineHeight: '1.4',
      fontWeight: 500 as const,
      letterSpacing: '0em',
    },
    body: {
      fontSize: '16px',
      lineHeight: '1.5',
      fontWeight: 400 as const,
      letterSpacing: '0em',
    },
    bodySmall: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: 400 as const,
      letterSpacing: '0.01em',
    },
    label: {
      fontSize: '12px',
      lineHeight: '1.4',
      fontWeight: 500 as const,
      letterSpacing: '0.02em',
    },
  },
} as const;

// ============================================================================
// SPACING SYSTEM (8dp Grid)
// ============================================================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// ============================================================================
// BREAKPOINTS (Responsive Design)
// ============================================================================

export const breakpoints = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
} as const;

// ============================================================================
// SEMANTIC TOKEN MAPS
// ============================================================================

export const semanticColors = {
  // Background Colors
  bg: {
    primary: colors.background,
    secondary: colors.neutral[100],
    tertiary: colors.neutral[200],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    tertiary: colors.neutral[400],
    inverse: '#FFFFFF',
  },

  // Border Colors
  border: {
    light: colors.neutral[200],
    default: colors.neutral[300],
    dark: colors.neutral[400],
  },

  // Interactive States
  interactive: {
    default: colors.primary[600],
    hover: colors.primary[700],
    active: colors.primary[800],
    disabled: colors.neutral[300],
  },

  // Status Indicators
  state: {
    success: colors.status.completed,
    warning: colors.status.inProgress,
    error: colors.status.cancelled,
    info: colors.status.new,
  },
} as const;

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

export const componentTokens = {
  // Button
  button: {
    primary: {
      bg: colors.primary[600],
      text: '#FFFFFF',
      border: colors.primary[600],
      hover: colors.primary[700],
      active: colors.primary[800],
      disabled: colors.neutral[300],
    },
    secondary: {
      bg: colors.neutral[100],
      text: colors.textPrimary,
      border: colors.neutral[300],
      hover: colors.neutral[200],
      active: colors.neutral[300],
      disabled: colors.neutral[200],
    },
    danger: {
      bg: colors.priority.high,
      text: '#FFFFFF',
      border: colors.priority.high,
      hover: '#DC2626',
      active: '#B91C1C',
      disabled: colors.neutral[300],
    },
  },

  // Badge
  badge: {
    status: {
      new: colors.status.new,
      inProgress: colors.status.inProgress,
      completed: colors.status.completed,
      cancelled: colors.status.cancelled,
    },
    priority: {
      low: colors.priority.low,
      medium: colors.priority.medium,
      high: colors.priority.high,
    },
  },

  // Input
  input: {
    bg: '#FFFFFF',
    border: colors.neutral[300],
    borderFocus: colors.primary[600],
    text: colors.textPrimary,
    placeholder: colors.textSecondary,
    disabled: colors.neutral[100],
  },

  // Card
  card: {
    bg: '#FFFFFF',
    border: colors.neutral[200],
    shadow: shadows.md,
  },

  // Form Label
  label: {
    text: colors.textPrimary,
    required: colors.priority.high,
  },
} as const;

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Breakpoints = typeof breakpoints;
export type SemanticColors = typeof semanticColors;
export type ComponentTokens = typeof componentTokens;
