import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import {
  BriefcaseBusiness,
  LayoutDashboard,
  Settings,
} from 'lucide-react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ApplicationsScreen } from '../screens/ApplicationsScreen';
import { ApplicationDetailsScreen } from '../screens/ApplicationDetailsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AddApplicationScreen } from '../screens/AddApplicationScreen';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { Theme } from '../../shared/theme/theme';

export type MobileTabParamList = {
  Dashboard: undefined;
  Applications: undefined;
  Settings: undefined;
};

export type MobileStackParamList = {
  MainTabs: NavigatorScreenParams<MobileTabParamList>;
  ApplicationDetails: {
    applicationId: string;
  };
  AddApplication: undefined;
};

const Stack = createNativeStackNavigator<MobileStackParamList>();
const Tab = createBottomTabNavigator<MobileTabParamList>();

function getTabIcon(
  routeName: keyof MobileTabParamList,
  color: string,
  size: number,
  focused: boolean,
  styles: ReturnType<typeof createStyles>,
): React.JSX.Element {
  const iconSize = focused ? size + 1 : size;
  const strokeWidth = focused ? 2.5 : 2;

  const iconProps = {
    size: iconSize,
    color,
    strokeWidth,
  };

  return (
    <View
      style={[styles.iconContainer, focused && styles.iconContainerFocused]}
    >
      {routeName === 'Dashboard' && <LayoutDashboard {...iconProps} />}
      {routeName === 'Applications' && <BriefcaseBusiness {...iconProps} />}
      {routeName === 'Settings' && <Settings {...iconProps} />}
    </View>
  );
}

function MainTabs(): React.JSX.Element {
  const { theme } = useTheme();

  const styles = createStyles(theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: styles.tabBar,

        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,

        tabBarLabelStyle: styles.tabBarLabel,

        tabBarIcon: ({ color, size, focused }) =>
          getTabIcon(route.name, color, size, focused, styles),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function MobileNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />

      <Stack.Screen
        name="ApplicationDetails"
        component={ApplicationDetailsScreen}
      />

      <Stack.Screen name="AddApplication" component={AddApplicationScreen} />
    </Stack.Navigator>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    tabBar: {
      height: 72,
      paddingTop: 8,
      paddingBottom: 10,
      backgroundColor: theme.surface,
      borderTopColor: theme.border,
    },

    tabBarLabel: {
      fontSize: 11,
      fontWeight: '600',
    },

    iconContainer: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },

    iconContainerFocused: {
      backgroundColor: theme.surfaceSecondary,
    },
  });
}
