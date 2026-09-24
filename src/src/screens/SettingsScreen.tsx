import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>PREFERENCES</Text>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your tracker.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#888',
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '700',
    color: '#171717',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#707070',
  },
});
