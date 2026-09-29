import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';
import { useApplicationStore } from '../../shared/store/ApplicationStore';
import {
  formatStatus,
  getStatusCounts,
} from '../../shared/utils/applicationFormatter';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';
import { useSettings } from '../../shared/settings/SettingsProvider';
import { getStartOfWeek } from '../../shared/utils/dateFormatter';
import { ApplicationSummary, StatusRow } from '../components';

type DashboardScreenProps = {
  onViewApplications: () => void;
};

const WEEKLY_GOAL = 5;

export function DashboardScreen({ onViewApplications }: DashboardScreenProps) {
  const { theme } = useTheme();
  const { formatRelativeDate } = useDateFormatter();

  const applications = useApplicationStore(state => state.applications);

  const events = useApplicationStore(state => state.events);

  const now = new Date();

  const { weekStart } = useSettings();

  const startOfWeek = getStartOfWeek(now, weekStart);

  const applicationsThisWeek = applications.filter(
    application =>
      application.appliedAt && new Date(application.appliedAt) >= startOfWeek,
  );
  const weeklyProgress = Math.min(applicationsThisWeek.length / WEEKLY_GOAL, 1);

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        (b.appliedAt ? new Date(b.appliedAt).getTime() : 0) -
        (a.appliedAt ? new Date(a.appliedAt).getTime() : 0),
    )
    .slice(0, 5);

  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const statusCounts = getStatusCounts(applications);

  const activeApplications = applications.filter(
    application =>
      !['rejected', 'withdrawn', 'closed'].includes(application.status),
  ).length;

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.eyebrow,
            {
              color: theme.textMuted,
            },
          ]}
        >
          OVERVIEW
        </Text>

        <Text
          style={[
            styles.title,
            {
              color: theme.text,
            },
          ]}
        >
          Dashboard
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          See how your job search is moving.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              CURRENT WEEK
            </Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: theme.text,
                },
              ]}
            >
              {applicationsThisWeek.length}
            </Text>

            <Text
              style={[
                styles.statDescription,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              applications
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              ACTIVE
            </Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: theme.text,
                },
              ]}
            >
              {activeApplications}
            </Text>

            <Text
              style={[
                styles.statDescription,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              applications
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              INTERVIEWS
            </Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: theme.text,
                },
              ]}
            >
              {statusCounts.interview}
            </Text>

            <Text
              style={[
                styles.statDescription,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              current
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              OFFERS
            </Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: theme.text,
                },
              ]}
            >
              {statusCounts.offer}
            </Text>

            <Text
              style={[
                styles.statDescription,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              current
            </Text>
          </View>
        </View>

        <View style={styles.mainGrid}>
          <View style={styles.primaryColumn}>
            <View
              style={[
                styles.section,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <View>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        color: theme.text,
                      },
                    ]}
                  >
                    Weekly goal
                  </Text>

                  <Text
                    style={[
                      styles.sectionSubtitle,
                      {
                        color: theme.textMuted,
                      },
                    ]}
                  >
                    {applicationsThisWeek.length} of {WEEKLY_GOAL} applications
                  </Text>
                </View>

                <Text
                  style={[
                    styles.goalPercent,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  {Math.round(weeklyProgress * 100)}%
                </Text>
              </View>

              <View
                style={[
                  styles.progressTrack,
                  {
                    backgroundColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${weeklyProgress * 100}%`,
                      backgroundColor: theme.textSecondary,
                    },
                  ]}
                />
              </View>
            </View>

            <View
              style={[
                styles.section,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Recent applications
                </Text>

                <Pressable onPress={onViewApplications}>
                  <Text
                    style={[
                      styles.viewAll,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    View all
                  </Text>
                </Pressable>
              </View>

              {recentApplications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text
                    style={[
                      styles.emptyTitle,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    No applications yet
                  </Text>

                  <Text
                    style={[
                      styles.emptyText,
                      {
                        color: theme.textMuted,
                      },
                    ]}
                  >
                    Add your first application to start tracking your search.
                  </Text>
                </View>
              ) : (
                <View>
                  {recentApplications.map(application => (
                    <ApplicationSummary
                      key={application.id}
                      application={application}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.secondaryColumn}>
            <View
              style={[
                styles.section,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Activity
                </Text>
              </View>

              {recentEvents.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text
                    style={[
                      styles.emptyText,
                      {
                        color: theme.textMuted,
                      },
                    ]}
                  >
                    No activity yet.
                  </Text>
                </View>
              ) : (
                <View>
                  {recentEvents.map(event => {
                    const application = applications.find(
                      item => item.id === event.applicationId,
                    );

                    if (!application) {
                      return null;
                    }

                    return (
                      <View key={event.id} style={styles.activityItem}>
                        <View
                          style={[
                            styles.activityDot,
                            {
                              backgroundColor: theme.textSecondary,
                            },
                          ]}
                        />

                        <View style={styles.activityContent}>
                          <Text
                            style={[
                              styles.activityTitle,
                              {
                                color: theme.text,
                              },
                            ]}
                          >
                            {formatStatus(event.status)}
                          </Text>

                          <Text
                            style={[
                              styles.activityApplication,
                              {
                                color: theme.textSecondary,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {application.title}
                          </Text>

                          <Text
                            style={[
                              styles.activityDate,
                              {
                                color: theme.textFaint,
                              },
                            ]}
                          >
                            {formatRelativeDate(event.createdAt)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            <View
              style={[
                styles.section,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Status
                </Text>
              </View>

              <StatusRow label="Interested" count={statusCounts.interested} />

              <StatusRow label="Applied" count={statusCounts.applied} />

              <StatusRow
                label="Recruiter Contact"
                count={statusCounts.recruiter_contact}
              />

              <StatusRow label="Interview" count={statusCounts.interview} />

              <StatusRow label="Offer" count={statusCounts.offer} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 22,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 28,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    flex: 1,
    minHeight: 112,
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
  },

  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },

  statValue: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '700',
  },

  statDescription: {
    marginTop: 2,
    fontSize: 12,
  },

  mainGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  primaryColumn: {
    flex: 1.6,
    gap: 12,
  },

  secondaryColumn: {
    flex: 1,
    gap: 12,
  },

  section: {
    padding: 18,
    borderWidth: 1,
    borderRadius: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
  },

  viewAll: {
    fontSize: 12,
    fontWeight: '600',
  },

  goalPercent: {
    fontSize: 18,
    fontWeight: '700',
  },

  progressTrack: {
    height: 8,
    marginTop: 16,
    overflow: 'hidden',
    borderRadius: 4,
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  activityItem: {
    flexDirection: 'row',
    paddingVertical: 9,
  },

  activityDot: {
    width: 7,
    height: 7,
    marginTop: 5,
    marginRight: 10,
    borderRadius: 4,
  },

  activityContent: {
    flex: 1,
    minWidth: 0,
  },

  activityTitle: {
    fontSize: 12,
    fontWeight: '600',
  },

  activityApplication: {
    marginTop: 2,
    fontSize: 12,
  },

  activityDate: {
    marginTop: 3,
    fontSize: 10,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 12,
  },

  emptyTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
