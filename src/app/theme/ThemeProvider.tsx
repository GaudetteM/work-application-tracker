import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

import { darkTheme, lightTheme, Theme, ThemeMode } from './theme';

const THEME_STORAGE_KEY = 'work-tracker-theme';

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ColorSchemeName {
  return Appearance.getColorScheme();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');

  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    getSystemTheme(),
  );

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then(value => {
      if (value === 'light' || value === 'dark' || value === 'system') {
        setModeState(value);
      }
    });
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
  };

  const theme = useMemo(() => {
    if (mode === 'dark') {
      return darkTheme;
    }

    if (mode === 'light') {
      return lightTheme;
    }

    return systemColorScheme === 'dark' ? darkTheme : lightTheme;
  }, [mode, systemColorScheme]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      setMode,
    }),
    [theme, mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
