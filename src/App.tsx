import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicationsScreen } from './app/screens/ApplicationsScreen';
import { DashboardScreen } from './app/screens/DashboardScreen';
import { SettingsScreen } from './app/screens/SettingsScreen';
import { ThemeProvider, useTheme } from './app/theme/ThemeProvider';
import { SettingsProvider } from './app/settings/SettingsProvider';

type Screen = 'dashboard' | 'applications' | 'settings';

function AppContent(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('dashboard');

  const { theme } = useTheme();

  const renderScreen = () => {
    switch (screen) {
      case 'applications':
        return <ApplicationsScreen />;

      case 'settings':
        return <SettingsScreen />;

      case 'dashboard':
      default:
        return (
          <DashboardScreen
            onViewApplications={() => setScreen('applications')}
          />
        );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View
        style={[
          styles.sidebar,
          {
            backgroundColor: theme.surfaceSecondary,
            borderRightColor: theme.borderStrong,
          },
        ]}
      >
        <Text
          style={[
            styles.logo,
            {
              color: theme.text,
            },
          ]}
        >
          Work Tracker
        </Text>

        <View style={styles.nav}>
          <NavItem
            label="Dashboard"
            active={screen === 'dashboard'}
            onPress={() => setScreen('dashboard')}
          />

          <NavItem
            label="Applications"
            active={screen === 'applications'}
            onPress={() => setScreen('applications')}
          />

          <NavItem
            label="Settings"
            active={screen === 'settings'}
            onPress={() => setScreen('settings')}
          />
        </View>
      </View>

      <View
        style={[
          styles.content,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

type NavItemProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function NavItem({ label, active, onPress }: NavItemProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.navItem,
        active && {
          backgroundColor: theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.navText,
          {
            color: active ? theme.text : theme.textSecondary,
          },
          active ? styles.navTextActive : styles.navTextInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },

  sidebar: {
    width: 220,
    padding: 24,
    borderRightWidth: StyleSheet.hairlineWidth,
  },

  logo: {
    marginBottom: 32,
    fontSize: 17,
    fontWeight: '700',
  },

  nav: {
    gap: 6,
  },

  navItem: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 7,
  },

  navText: {
    fontSize: 14,
  },

  navTextActive: {
    fontWeight: '600',
  },

  navTextInactive: {
    fontWeight: '400',
  },

  content: {
    flex: 1,
    padding: 48,
  },
});

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </ThemeProvider>
  );
}
