/**
 * Design Tokens - TypeScript
 * Type-safe design token definitions for the Billim Project
 * Provides typed access to all design system values
 */

// ===== TYPE DEFINITIONS =====

type ColorValue = string;
type SpacingValue = string;
type FontSizeValue = string;
type FontWeightValue = number;
type LineHeightValue = number;
type RadiusValue = string;
type ShadowValue = string;
type TransitionValue = string;
type ZIndexValue = number;

interface ColorShade {
  50?: ColorValue;
  100?: ColorValue;
  200?: ColorValue;
  300?: ColorValue;
  400?: ColorValue;
  500?: ColorValue;
  600?: ColorValue;
  700?: ColorValue;
  800?: ColorValue;
  900?: ColorValue;
}

interface StatusColors {
  success: ColorValue;
  warning: ColorValue;
  error: ColorValue;
  info: ColorValue;
}

interface PriorityColors {
  high: ColorValue;
  medium: ColorValue;
  low: ColorValue;
}

interface SemanticColors {
  textPrimary: ColorValue;
  textSecondary: ColorValue;
  textTertiary: ColorValue;
  textDisabled: ColorValue;
  bgPrimary: ColorValue;
  bgSecondary: ColorValue;
  bgTertiary: ColorValue;
  borderLight: ColorValue;
  borderBase: ColorValue;
  borderDark: ColorValue;
}

// ===== COLOR TOKENS =====

export const colors = {
  primary: {
    50: "#f8f7ff",
    100: "#ede9ff",
    200: "#ddd3ff",
    300: "#c4a9ff",
    400: "#a470ff",
    500: "#8838ff",
    600: "#7a1bef",
    700: "#6c0dd4",
    800: "#5a0ab8",
    900: "#4a089a",
  } as ColorShade,

  secondary: {
    50: "#f5f3ff",
    100: "#ede8ff",
    200: "#ddd3ff",
    300: "#c4a9ff",
    400: "#a470ff",
    500: "#7c3aed",
    600: "#6d28d9",
    700: "#5b21b6",
    800: "#4c1d95",
    900: "#2e1065",
  } as ColorShade,

  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  } as StatusColors,

  priority: {
    high: "#dc2626",
    medium: "#f59e0b",
    low: "#10b981",
  } as PriorityColors,

  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  } as ColorShade,

  semantic: {
    textPrimary: "var(--color-neutral-900)",
    textSecondary: "var(--color-neutral-600)",
    textTertiary: "var(--color-neutral-500)",
    textDisabled: "var(--color-neutral-400)",
    bgPrimary: "#ffffff",
    bgSecondary: "var(--color-neutral-50)",
    bgTertiary: "var(--color-neutral-100)",
    borderLight: "var(--color-neutral-200)",
    borderBase: "var(--color-neutral-300)",
    borderDark: "var(--color-neutral-400)",
  } as SemanticColors,
};

// ===== TYPOGRAPHY TOKENS =====

export const typography = {
  fontFamily: {
    display: '"Cinzel", serif',
    body: '"Josefin Sans", sans-serif',
    mono: '"Courier New", monospace',
  },

  fontSize: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem",      // 48px
  } as Record<string, FontSizeValue>,

  fontWeight: {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
  } as Record<string, FontWeightValue>,

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  } as Record<string, LineHeightValue>,
};

// ===== SPACING TOKENS (8dp GRID) =====

export const spacing = {
  0: "0",
  1: "0.5rem",      // 4px
  2: "1rem",        // 8px
  3: "1.5rem",      // 12px
  4: "2rem",        // 16px
  6: "3rem",        // 24px
  8: "4rem",        // 32px
  12: "6rem",       // 48px
  16: "8rem",       // 64px
} as Record<string, SpacingValue>;

// ===== BORDER RADIUS TOKENS =====

export const radius = {
  none: "0",
  sm: "0.25rem",     // 2px
  base: "0.375rem",  // 4px
  md: "0.5rem",      // 8px
  lg: "0.75rem",     // 12px
  xl: "1rem",        // 16px
  "2xl": "1.5rem",   // 24px
  full: "9999px",
} as Record<string, RadiusValue>;

// ===== SHADOW TOKENS =====

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px rgba(0, 0, 0, 0.15)",
} as Record<string, ShadowValue>;

// ===== TRANSITION TOKENS =====

export const transitions = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
} as Record<string, TransitionValue>;

// ===== Z-INDEX TOKENS =====

export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  tooltip: 1500,
} as Record<string, ZIndexValue>;

// ===== UTILITY FUNCTIONS =====

/**
 * Get a CSS custom property variable
 * @param token - Token name (e.g., "color-primary-500")
 * @returns CSS variable string (e.g., "var(--color-primary-500)")
 */
export const getCSSVariable = (token: string): string => {
  return `var(--${token})`;
};

/**
 * Get a color value from a palette and shade
 * @param palette - Color palette (e.g., "primary", "neutral")
 * @param shade - Color shade (e.g., "500", "600")
 * @returns Color hex value or undefined if not found
 */
export const getColor = (
  palette: keyof typeof colors,
  shade: string
): string | undefined => {
  const paletteColors = colors[palette];
  if (!paletteColors || typeof paletteColors !== "object") {
    return undefined;
  }
  return (paletteColors as Record<string, string>)[shade];
};

/**
 * Get a spacing value from the spacing scale
 * @param size - Spacing size (e.g., "1", "4", "8")
 * @returns Spacing value in rem
 */
export const getSpacing = (size: string | number): string | undefined => {
  return spacing[String(size)];
};

/**
 * Get a border radius value
 * @param radiusSize - Radius size (e.g., "sm", "md", "lg")
 * @returns Border radius value
 */
export const getRadius = (radiusSize: string): string | undefined => {
  return radius[radiusSize];
};

/**
 * Get a shadow value
 * @param shadowSize - Shadow size (e.g., "sm", "md", "lg")
 * @returns Shadow CSS value
 */
export const getShadow = (shadowSize: string): string | undefined => {
  return shadows[shadowSize];
};

/**
 * Get a transition value
 * @param speed - Transition speed (e.g., "fast", "base", "slow")
 * @returns Transition CSS value
 */
export const getTransition = (speed: string): string | undefined => {
  return transitions[speed];
};

// ===== TAILWIND CONFIG EXPORT =====
/**
 * Configuration object for Tailwind CSS integration
 * Can be imported in tailwind.config.ts
 */
export const tailwindConfig = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    status: colors.status,
    priority: colors.priority,
    neutral: colors.neutral,
    semantic: colors.semantic,
  },
  spacing,
  borderRadius: radius,
  boxShadow: shadows,
  transitionDuration: transitions,
  zIndex,
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize,
  fontWeight: typography.fontWeight,
  lineHeight: typography.lineHeight,
};

// ===== PRESET COMBINATIONS =====
/**
 * Common preset combinations for component styling
 */
export const presets = {
  // Button presets
  button: {
    primary: {
      bg: colors.primary[500],
      text: "#ffffff",
      hover: colors.primary[600],
      active: colors.primary[700],
    },
    secondary: {
      bg: colors.secondary[500],
      text: "#ffffff",
      hover: colors.secondary[600],
      active: colors.secondary[700],
    },
    ghost: {
      bg: "transparent",
      text: colors.primary[500],
      hover: colors.primary[50],
      active: colors.primary[100],
    },
  },

  // Card presets
  card: {
    default: {
      bg: colors.semantic.bgPrimary,
      border: colors.semantic.borderBase,
      shadow: shadows.base,
      radius: radius.lg,
    },
    elevated: {
      bg: colors.semantic.bgPrimary,
      border: "transparent",
      shadow: shadows.lg,
      radius: radius.lg,
    },
  },

  // Input presets
  input: {
    default: {
      bg: colors.semantic.bgPrimary,
      border: colors.semantic.borderBase,
      text: colors.semantic.textPrimary,
      placeholder: colors.semantic.textTertiary,
    },
    disabled: {
      bg: colors.semantic.bgTertiary,
      border: colors.semantic.borderLight,
      text: colors.semantic.textDisabled,
    },
  },

  // Status presets
  status: {
    success: {
      bg: `${colors.status.success}20`, // 20% opacity
      border: colors.status.success,
      text: colors.status.success,
    },
    warning: {
      bg: `${colors.status.warning}20`,
      border: colors.status.warning,
      text: colors.status.warning,
    },
    error: {
      bg: `${colors.status.error}20`,
      border: colors.status.error,
      text: colors.status.error,
    },
    info: {
      bg: `${colors.status.info}20`,
      border: colors.status.info,
      text: colors.status.info,
    },
  },
};

// ===== TYPE EXPORTS =====
export type {
  ColorValue,
  SpacingValue,
  FontSizeValue,
  FontWeightValue,
  LineHeightValue,
  RadiusValue,
  ShadowValue,
  TransitionValue,
  ZIndexValue,
  ColorShade,
  StatusColors,
  PriorityColors,
  SemanticColors,
};
