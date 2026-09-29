import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { useSettings } from '../../shared/settings/SettingsProvider';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { Theme } from '../../shared/theme/theme';
import { getStartOfWeek } from '../../shared/utils/dateFormatter';
import { getStatusCounts } from '../../shared/utils/applicationFormatter';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';
import type { MobileStackParamList } from '../navigation/MobileNavigator';

type NavigationProp = NativeStackNavigationProp<
  MobileStackParamList,
  'MainTabs'
>;

interface Props {
  navigation: NavigationProp;
}

export function DashboardScreen({ navigation }: Props): React.JSX.Element {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const applications = useApplicationStore(state => state.applications);

  const { weekStart, weeklyGoal } = useSettings();
  const { formatDate } = useDateFormatter();

  const now = new Date();
  const startOfWeek = getStartOfWeek(now, weekStart);

  const currentWeekApplications = applications.filter(application => {
    if (!application.appliedAt) {
      return false;
    }

    const appliedAt = new Date(application.appliedAt);

    return appliedAt >= startOfWeek && appliedAt <= now;
  });

  const statusCounts = getStatusCounts(applications);

  const activeApplications = applications.filter(
    application =>
      !['rejected', 'withdrawn', 'closed'].includes(application.status),
  ).length;

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  const progress = Math.min(currentWeekApplications.length / weeklyGoal, 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
          <Text style={styles.eyebrow}>WORK SEARCH</Text>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.weekCard}>
          <Text style={styles.weekLabel}>CURRENT WEEK</Text>

          <View style={styles.weekRow}>
            <Text style={styles.weekCount}>
              {currentWeekApplications.length}
            </Text>

            <Text style={styles.weekDescription}>applications</Text>
          </View>

          <Text style={styles.weekGoal}>Goal: {weeklyGoal} applications</Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ACTIVE</Text>
            <Text style={styles.statValue}>{activeApplications}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>INTERVIEWS</Text>
            <Text style={styles.statValue}>{statusCounts.interview}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>OFFERS</Text>
            <Text style={styles.statValue}>{statusCounts.offer}</Text>
          </View>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('AddApplication')}
        >
          <Text style={styles.addButtonText}>+ Add Application</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Applications</Text>

          {recentApplications.length === 0 ? (
            <Text style={styles.emptyText}>No applications yet.</Text>
          ) : (
            <View style={styles.applicationList}>
              {recentApplications.map(application => (
                <View key={application.id} style={styles.applicationRow}>
                  <View style={styles.applicationInfo}>
                    <Text style={styles.applicationTitle} numberOfLines={1}>
                      {application.title}
                    </Text>

                    <Text style={styles.applicationCompany} numberOfLines={1}>
                      {application.company}
                    </Text>
                  </View>

                  <Text style={styles.applicationDate}>
                    {application.appliedAt
                      ? formatDate(application.appliedAt)
                      : 'Interested'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 24,
      paddingBottom: 32,
    },
    eyebrow: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      color: theme.textMuted,
    },
    title: {
      marginTop: 4,
      fontSize: 32,
      fontWeight: '700',
      color: theme.text,
    },
    weekCard: {
      marginTop: 24,
      padding: 20,
      borderRadius: 16,
      backgroundColor: theme.surfaceSecondary,
    },
    weekLabel: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      color: theme.textMuted,
    },
    weekRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: 8,
    },
    weekCount: {
      fontSize: 48,
      fontWeight: '700',
      color: theme.text,
    },
    weekDescription: {
      marginLeft: 8,
      fontSize: 17,
      color: theme.textSecondary,
    },
    weekGoal: {
      marginTop: 4,
      fontSize: 13,
      color: theme.textMuted,
    },
    progressTrack: {
      height: 6,
      marginTop: 12,
      borderRadius: 3,
      backgroundColor: theme.border,
      overflow: 'hidden',
    },
    progressFill: {
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.accent,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 16,
    },
    statCard: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      backgroundColor: theme.surfaceSecondary,
    },
    statLabel: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: theme.textMuted,
    },
    statValue: {
      marginTop: 6,
      fontSize: 22,
      fontWeight: '700',
      color: theme.text,
    },
    addButton: {
      marginTop: 16,
      minHeight: 52,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.accent,
    },
    addButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.accentText,
    },
    section: {
      marginTop: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
    },
    applicationList: {
      marginTop: 8,
    },
    applicationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    applicationInfo: {
      flex: 1,
      marginRight: 12,
    },
    applicationTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
    },
    applicationCompany: {
      marginTop: 3,
      fontSize: 13,
      color: theme.textMuted,
    },
    applicationDate: {
      fontSize: 12,
      color: theme.textMuted,
    },
    emptyText: {
      marginTop: 12,
      fontSize: 14,
      color: theme.textMuted,
    },
  });
}

