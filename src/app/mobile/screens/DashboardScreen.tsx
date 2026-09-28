import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { useSettings } from '../../shared/settings/SettingsProvider';
import { getStartOfWeek } from '../../shared/utils/dateFormatter';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';

export function DashboardScreen(): React.JSX.Element {
  const applications = useApplicationStore(state => state.applications);

  const { weekStart } = useSettings();
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

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  const weeklyGoal = 5;
  const progress = Math.min(currentWeekApplications.length / weeklyGoal, 1);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>WORK SEARCH</Text>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.weekCard}>
        <Text style={styles.weekLabel}>CURRENT WEEK</Text>

        <View style={styles.weekRow}>
          <Text style={styles.weekCount}>{currentWeekApplications.length}</Text>

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

      <Pressable style={styles.addButton}>
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
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 32,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#777772',
  },
  title: {
    marginTop: 4,
    fontSize: 32,
    fontWeight: '700',
    color: '#181816',
  },
  weekCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F4F4F1',
  },
  weekLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#777772',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  weekCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#181816',
  },
  weekDescription: {
    marginLeft: 8,
    fontSize: 17,
    color: '#555550',
  },
  weekGoal: {
    marginTop: 4,
    fontSize: 13,
    color: '#777772',
  },
  progressTrack: {
    height: 6,
    marginTop: 12,
    borderRadius: 3,
    backgroundColor: '#D9D9D5',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#181816',
  },
  addButton: {
    marginTop: 16,
    minHeight: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181816',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181816',
  },
  applicationList: {
    marginTop: 8,
  },
  applicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D9D9D5',
  },
  applicationInfo: {
    flex: 1,
    marginRight: 12,
  },
  applicationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#181816',
  },
  applicationCompany: {
    marginTop: 3,
    fontSize: 13,
    color: '#777772',
  },
  applicationDate: {
    fontSize: 12,
    color: '#777772',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#777772',
  },
});
