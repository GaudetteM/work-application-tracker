import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { useSettings } from '../../shared/settings/SettingsProvider';
import { useTheme } from '../../shared/theme/ThemeProvider';
import { Theme } from '../../shared/theme/theme';
import { OptionButton, Stepper } from '../components';

export function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const loadMockData = useApplicationStore(state => state.loadMockData);

  const {
    dateFormat,
    timeFormat,
    weekStart,
    weeklyGoal,
    setDateFormat,
    setTimeFormat,
    setWeekStart,
    setWeeklyGoal,
  } = useSettings();

  const styles = createStyles(theme);

  const getSystemName = () => {
    return Platform.OS === 'macos' ? 'macOS' : 'system';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>PREFERENCES</Text>

      <Text style={styles.title}>Settings</Text>

      <Text style={styles.subtitle}>
        Configure how Work Tracker looks and displays information.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly goal</Text>

        <Text style={styles.sectionDescription}>
          How many applications you're aiming to submit each week.
        </Text>

        <Stepper
          value={weeklyGoal}
          onChange={setWeeklyGoal}
          min={1}
          max={50}
          suffix="applications"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <Text style={styles.sectionDescription}>
          Choose how Work Tracker looks.
        </Text>

        <View style={styles.optionGroup}>
          <OptionButton
            label="System"
            description={`Follow ${getSystemName()} appearance`}
            selected={mode === 'system'}
            onPress={() => setMode('system')}
          />

          <OptionButton
            label="Light"
            selected={mode === 'light'}
            onPress={() => setMode('light')}
          />

          <OptionButton
            label="Dark"
            selected={mode === 'dark'}
            onPress={() => setMode('dark')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date format</Text>

        <Text style={styles.sectionDescription}>
          Choose how dates are displayed throughout the app.
        </Text>

        <View style={styles.optionGroup}>
          <OptionButton
            label="09/26/2026"
            description="US numeric"
            selected={dateFormat === 'numeric_us'}
            onPress={() => setDateFormat('numeric_us')}
          />

          <OptionButton
            label="26/09/2026"
            description="International numeric"
            selected={dateFormat === 'numeric_international'}
            onPress={() => setDateFormat('numeric_international')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time format</Text>

        <Text style={styles.sectionDescription}>
          Choose how times are displayed throughout the app.
        </Text>

        <View style={styles.optionGroup}>
          <OptionButton
            label="12-hour"
            description="2:30 PM"
            selected={timeFormat === '12h'}
            onPress={() => setTimeFormat('12h')}
          />

          <OptionButton
            label="24-hour"
            description="14:30"
            selected={timeFormat === '24h'}
            onPress={() => setTimeFormat('24h')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Week starts on</Text>

        <Text style={styles.sectionDescription}>
          Used for weekly application totals and statistics.
        </Text>

        <View style={styles.optionGroup}>
          <OptionButton
            label="Sunday"
            selected={weekStart === 'sunday'}
            onPress={() => setWeekStart('sunday')}
          />

          <OptionButton
            label="Monday"
            selected={weekStart === 'monday'}
            onPress={() => setWeekStart('monday')}
          />
        </View>
      </View>

      {__DEV__ ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer</Text>

          <Text style={styles.sectionDescription}>
            Quickly populate the applications list with sample data for testing.
          </Text>

          <Pressable style={styles.mockDataButton} onPress={loadMockData}>
            <Text style={styles.mockDataButtonText}>Populate mock data</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingBottom: 48,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: theme.textMuted,
    },
    title: {
      marginTop: 4,
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
    },
    subtitle: {
      marginTop: 8,
      maxWidth: 620,
      fontSize: 14,
      lineHeight: 20,
      color: theme.textSecondary,
    },
    section: {
      marginTop: 36,
      maxWidth: 720,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    sectionDescription: {
      marginTop: 5,
      marginBottom: 12,
      fontSize: 13,
      lineHeight: 18,
      color: theme.textSecondary,
    },
    optionGroup: {
      gap: 8,
    },
    mockDataButton: {
      alignSelf: 'flex-start',
      minHeight: 42,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.surface,
    },
    mockDataButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.text,
    },
  });
}
