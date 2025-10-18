// Fall Theme - Warm, cozy, inviting
const fallTheme = {
  primary: {
    50: '#FFFBEB',   // Warm cream background
    100: '#FEF3C7',  // Light amber
    200: '#FDE68A',  // Border amber
    600: '#D97706',  // Rich amber
    700: '#B45309',  // Dark amber
    800: '#92400E',  // Darker amber
    900: '#78350F',  // Darkest amber
  },
  background: {
    primary: '#FFFBEB',    // Warm cream background
    secondary: '#FEF3C7',  // Light cream
    white: '#FFFFFF',      // White
  },
  text: {
    primary: '#78350F',    // Deep amber (titles)
    secondary: '#B45309',  // Medium amber (locations)
    muted: '#D97706',      // Rich amber (subtle text)
    white: '#FFFFFF',      // White text
  },
  badge: {
    active: '#D97706',     // Rich amber
    inactive: '#FFFFFF',   // White
    time: '#FEF3C7',       // Light cream
  },
  border: {
    light: '#FDE68A',      // Light amber border
    card: '#FEF3C7',       // Card border
  }
};

// Dark Fall Theme - Cozy dark mode
const fallThemeDark = {
  primary: {
    50: '#1A1A1A',   // Dark background
    100: '#2D2D2D',  // Darker surface
    200: '#404040',  // Border dark
    600: '#F59E0B',  // Bright amber for accents
    700: '#FBBF24',  // Light amber
    800: '#FCD34D',  // Lighter amber
    900: '#FEF3C7',  // Lightest amber
  },
  background: {
    primary: '#0F0F0F',    // Deep dark background
    secondary: '#1A1A1A',  // Dark surface
    white: '#2D2D2D',      // Dark white
  },
  text: {
    primary: '#FEF3C7',    // Light text (titles)
    secondary: '#FCD34D',  // Medium light text (locations)
    muted: '#FBBF24',      // Light amber (subtle text)
    white: '#FFFFFF',      // Pure white text
  },
  badge: {
    active: '#F59E0B',     // Bright amber
    inactive: '#2D2D2D',   // Dark
    time: '#1A1A1A',       // Dark surface
  },
  border: {
    light: '#404040',      // Dark border
    card: '#2D2D2D',       // Card border
  }
};

export const themes = {
  light: fallTheme,
  dark: fallThemeDark,
};

export type ThemeName = keyof typeof themes;
export type Theme = typeof fallTheme;

// Default theme
export const colors = fallTheme;