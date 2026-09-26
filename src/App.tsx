import React, { useState } from 'react';

import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ApplicationsScreen } from './src/screens/ApplicationsScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Screen = 'dashboard' | 'applications' | 'settings';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('dashboard');

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
    <SafeAreaView style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={styles.logo}>Work Tracker</Text>

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

      <View style={styles.content}>{renderScreen()}</View>
    </SafeAreaView>
  );
}

type NavItemProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function NavItem({ label, active, onPress }: NavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.navItem, active && styles.navItemActive]}
    >
      <Text style={[styles.navText, active && styles.navTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F7F7F5',
  },

  sidebar: {
    width: 220,
    padding: 24,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#D9D9D6',
    backgroundColor: '#F1F1EF',
  },

  logo: {
    marginBottom: 32,
    fontSize: 17,
    fontWeight: '700',
    color: '#171717',
  },

  nav: {
    gap: 6,
  },

  navItem: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 7,
  },

  navItemActive: {
    backgroundColor: '#E3E3E0',
  },

  navText: {
    fontSize: 14,
    color: '#666',
  },

  navTextActive: {
    color: '#171717',
    fontWeight: '600',
  },

  content: {
    flex: 1,
    padding: 48,
  },
});

export default App;
