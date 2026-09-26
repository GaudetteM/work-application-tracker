import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ApplicationStatus, JobApplication } from '../types/application';
import { useApplicationStore } from '../store/ApplicationStore';

type DashboardScreenProps = {
  onViewApplications: () => void;
};

const WEEKLY_GOAL = 5;

export function DashboardScreen({ onViewApplications }: DashboardScreenProps) {
  const applications = useApplicationStore(state => state.applications);

  const events = useApplicationStore(state => state.events);

  const now = new Date();
  const startOfWeek = getStartOfWeek(now);

  const applicationsThisWeek = applications.filter(
    application => new Date(application.appliedAt) >= startOfWeek,
  );

  const weeklyProgress = Math.min(applicationsThisWeek.length / WEEKLY_GOAL, 1);

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    )
    .slice(0, 5);

  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const statusCounts = getStatusCounts(applications);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>OVERVIEW</Text>

        <Text style={styles.title}>Dashboard</Text>

        <Text style={styles.subtitle}>See how your job search is moving.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>THIS WEEK</Text>

            <Text style={styles.statValue}>{applicationsThisWeek.length}</Text>

            <Text style={styles.statDescription}>applications</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ACTIVE</Text>

            <Text style={styles.statValue}>
              {
                applications.filter(
                  application =>
                    !['rejected', 'withdrawn', 'closed'].includes(
                      application.status,
                    ),
                ).length
              }
            </Text>

            <Text style={styles.statDescription}>applications</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>INTERVIEWS</Text>

            <Text style={styles.statValue}>{statusCounts.interview}</Text>

            <Text style={styles.statDescription}>current</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>OFFERS</Text>

            <Text style={styles.statValue}>{statusCounts.offer}</Text>

            <Text style={styles.statDescription}>current</Text>
          </View>
        </View>

        <View style={styles.mainGrid}>
          <View style={styles.primaryColumn}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Weekly goal</Text>

                  <Text style={styles.sectionSubtitle}>
                    {applicationsThisWeek.length} of {WEEKLY_GOAL} applications
                  </Text>
                </View>

                <Text style={styles.goalPercent}>
                  {Math.round(weeklyProgress * 100)}%
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${weeklyProgress * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent applications</Text>

                <Pressable onPress={onViewApplications}>
                  <Text style={styles.viewAll}>View all</Text>
                </Pressable>
              </View>

              {recentApplications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No applications yet</Text>

                  <Text style={styles.emptyText}>
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
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Activity</Text>
              </View>

              {recentEvents.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No activity yet.</Text>
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
                        <View style={styles.activityDot} />

                        <View style={styles.activityContent}>
                          <Text style={styles.activityTitle}>
                            {formatStatus(event.status)}
                          </Text>

                          <Text
                            style={styles.activityApplication}
                            numberOfLines={1}
                          >
                            {application.title}
                          </Text>

                          <Text style={styles.activityDate}>
                            {formatRelativeDate(event.createdAt)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Status</Text>
              </View>

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
    </View>
  );
}

function ApplicationSummary({ application }: { application: JobApplication }) {
  return (
    <View style={styles.applicationRow}>
      <View style={styles.applicationMain}>
        <Text style={styles.applicationTitle} numberOfLines={1}>
          {application.title}
        </Text>

        <Text style={styles.applicationCompany}>{application.company}</Text>
      </View>

      <View style={styles.applicationMeta}>
        <Text style={styles.applicationStatus}>
          {formatStatus(application.status)}
        </Text>

        <Text style={styles.applicationDate}>
          {formatDate(application.appliedAt)}
        </Text>
      </View>
    </View>
  );
}

function StatusRow({ label, count }: { label: string; count: number }) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}</Text>

      <Text style={styles.statusCount}>{count}</Text>
    </View>
  );
}

function getStatusCounts(
  applications: JobApplication[],
): Record<ApplicationStatus, number> {
  return applications.reduce(
    (counts, application) => {
      counts[application.status] += 1;
      return counts;
    },
    {
      applied: 0,
      recruiter_contact: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
      closed: 0,
    } as Record<ApplicationStatus, number>,
  );
}

function getStartOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);
  result.setHours(0, 0, 0, 0);

  return result;
}

function formatStatus(status: ApplicationStatus) {
  switch (status) {
    case 'recruiter_contact':
      return 'Recruiter Contact';

    case 'interview':
      return 'Interview';

    case 'offer':
      return 'Offer';

    case 'rejected':
      return 'Rejected';

    case 'withdrawn':
      return 'Withdrawn';

    case 'closed':
      return 'Closed';

    case 'applied':
    default:
      return 'Applied';
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function formatRelativeDate(date: string) {
  const value = new Date(date);
  const diff = Date.now() - value.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return 'Yesterday';
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(date);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F5',
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
    color: '#999994',
  },

  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '700',
    color: '#181816',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#777772',
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
    borderColor: '#E3E3E0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#999994',
  },

  statValue: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '700',
    color: '#181816',
  },

  statDescription: {
    marginTop: 2,
    fontSize: 12,
    color: '#8A8A84',
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
    borderColor: '#E3E3E0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#252522',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#8A8A84',
  },

  sectionCount: {
    fontSize: 12,
    color: '#999994',
  },

  goalPercent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#252522',
  },

  progressTrack: {
    height: 8,
    marginTop: 16,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#E8E8E4',
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#555550',
  },

  applicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E4',
  },

  applicationMain: {
    flex: 1,
    minWidth: 0,
    paddingRight: 16,
  },

  applicationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#252522',
  },

  applicationCompany: {
    marginTop: 3,
    fontSize: 12,
    color: '#8A8A84',
  },

  applicationMeta: {
    alignItems: 'flex-end',
  },

  applicationStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666660',
  },

  applicationDate: {
    marginTop: 3,
    fontSize: 11,
    color: '#A0A09A',
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
    backgroundColor: '#555550',
  },

  activityContent: {
    flex: 1,
    minWidth: 0,
  },

  viewAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555550',
  },

  activityTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#252522',
  },

  activityApplication: {
    marginTop: 2,
    fontSize: 12,
    color: '#666660',
  },

  activityDate: {
    marginTop: 3,
    fontSize: 10,
    color: '#A0A09A',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E4',
  },

  statusLabel: {
    fontSize: 12,
    color: '#666660',
  },

  statusCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#252522',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 12,
  },

  emptyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555550',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: '#999994',
    textAlign: 'center',
  },
});
