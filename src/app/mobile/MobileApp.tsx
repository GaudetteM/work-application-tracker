import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MobileNavigator } from './navigation/MobileNavigator';
import { ThemeProvider } from '../shared/theme/ThemeProvider';
import { SettingsProvider } from '../shared/settings/SettingsProvider';

export function MobileApp(): React.JSX.Element {
  console.log('MobileNavigator:', MobileNavigator);

  return (
    <ThemeProvider>
      <SettingsProvider>
        <View style={styles.container}>
          <NavigationContainer>
            <MobileNavigator />
          </NavigationContainer>
        </View>
      </SettingsProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
