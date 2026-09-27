import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../settings/SettingsProvider';
import { useTheme } from '../theme/ThemeProvider';
import { Theme } from '../theme/theme';

type OptionButtonProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  theme: Theme;
};

export function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();

  const {
    dateFormat,
    timeFormat,
    weekStart,
    setDateFormat,
    setTimeFormat,
    setWeekStart,
  } = useSettings();

  const styles = createStyles(theme);

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
        <Text style={styles.sectionTitle}>Appearance</Text>

        <Text style={styles.sectionDescription}>
          Choose how Work Tracker looks.
        </Text>

        <View style={styles.optionGroup}>
          <OptionButton
            label="System"
            description="Follow macOS appearance"
            selected={mode === 'system'}
            onPress={() => setMode('system')}
            theme={theme}
          />

          <OptionButton
            label="Light"
            selected={mode === 'light'}
            onPress={() => setMode('light')}
            theme={theme}
          />

          <OptionButton
            label="Dark"
            selected={mode === 'dark'}
            onPress={() => setMode('dark')}
            theme={theme}
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
            label="Sep 26, 2026"
            description="US readable"
            selected={dateFormat === 'month_day_year'}
            onPress={() => setDateFormat('month_day_year')}
            theme={theme}
          />

          <OptionButton
            label="26 Sep 2026"
            description="International readable"
            selected={dateFormat === 'day_month_year'}
            onPress={() => setDateFormat('day_month_year')}
            theme={theme}
          />

          <OptionButton
            label="09/26/2026"
            description="US numeric"
            selected={dateFormat === 'numeric_us'}
            onPress={() => setDateFormat('numeric_us')}
            theme={theme}
          />

          <OptionButton
            label="26/09/2026"
            description="International numeric"
            selected={dateFormat === 'numeric_international'}
            onPress={() => setDateFormat('numeric_international')}
            theme={theme}
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
            theme={theme}
          />

          <OptionButton
            label="24-hour"
            description="14:30"
            selected={timeFormat === '24h'}
            onPress={() => setTimeFormat('24h')}
            theme={theme}
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
            theme={theme}
          />

          <OptionButton
            label="Monday"
            selected={weekStart === 'monday'}
            onPress={() => setWeekStart('monday')}
            theme={theme}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function OptionButton({
  label,
  description,
  selected,
  onPress,
  theme,
}: OptionButtonProps) {
  const styles = createOptionStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <View style={styles.optionContent}>
        <Text
          style={[styles.optionLabel, selected && styles.optionLabelSelected]}
        >
          {label}
        </Text>

        {description && (
          <Text style={styles.optionDescription}>{description}</Text>
        )}
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
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
  });
}

function createOptionStyles(theme: Theme) {
  return StyleSheet.create({
    option: {
      minHeight: 52,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.surface,
    },
    optionSelected: {
      borderColor: theme.borderStrong,
      backgroundColor: theme.surfaceSecondary,
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    optionLabelSelected: {
      fontWeight: '600',
      color: theme.text,
    },
    optionDescription: {
      marginTop: 2,
      fontSize: 12,
      color: theme.textMuted,
    },
    radio: {
      width: 18,
      height: 18,
      marginLeft: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.borderStrong,
      borderRadius: 9,
    },
    radioSelected: {
      borderColor: theme.text,
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.text,
    },
  });
}
