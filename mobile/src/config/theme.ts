import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B35',
    secondary: '#004E89',
    tertiary: '#F77F00',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#B00020',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#000000',
    onSurface: '#000000',
  },
};
