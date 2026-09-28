import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { MobileStackParamList } from '../navigation/MobileNavigator';
import { Theme } from '../../shared/theme/theme';

type NavigationProp = NativeStackNavigationProp<
  MobileStackParamList,
  'MainTabs'
>;

interface Props {
  navigation: NavigationProp;
}

export function ApplicationsScreen(props: Props): React.JSX.Element {
  const { navigation } = props;
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const applications = useApplicationStore(state => state.applications);

  const { formatDate } = useDateFormatter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplications = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    if (!search) {
      return applications;
    }

    return applications.filter(application => {
      return (
        application.title.toLowerCase().includes(search) ||
        application.company.toLowerCase().includes(search) ||
        application.location?.toLowerCase().includes(search)
      );
    });
  }, [applications, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>WORK SEARCH</Text>
        <Text style={styles.title}>Applications</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search applications"
          placeholderTextColor={theme.textMuted}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={application => application.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate('ApplicationDetails', {
                applicationId: item.id,
              });
            }}
            style={({ pressed }) => [
              styles.applicationCard,
              pressed && styles.applicationCardPressed,
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.applicationInfo}>
                <Text style={styles.applicationTitle} numberOfLines={1}>
                  {item.title}
                </Text>

                <Text style={styles.company} numberOfLines={1}>
                  {item.company}
                </Text>
              </View>

              <Text style={styles.chevron}>›</Text>
            </View>

            <View style={styles.metadata}>
              <View
                style={[
                  styles.badge,
                  getEmploymentBadgeStyle(item.employmentType, styles),
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    getEmploymentBadgeTextStyle(item.employmentType, styles),
                  ]}
                >
                  {formatEmploymentType(item.employmentType)}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {formatStatus(item.status)}
                </Text>
              </View>

              <View style={styles.spacer} />

              <Text style={styles.date}>
                {item.appliedAt ? formatDate(item.appliedAt) : 'Interested'}
              </Text>
            </View>

            {item.location ? (
              <Text style={styles.location} numberOfLines={1}>
                {item.location}
              </Text>
            ) : null}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {applications.length === 0
                ? 'No applications yet'
                : 'No matches found'}
            </Text>

            <Text style={styles.emptyText}>
              {applications.length === 0
                ? 'Add your first application to start tracking your search.'
                : 'Try a different search.'}
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={() => {
          navigation.navigate('AddApplication');
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function formatEmploymentType(employmentType: string): string {
  switch (employmentType) {
    case 'full_time':
      return 'Full-time';

    case 'part_time':
      return 'Part-time';

    case 'contract':
      return 'Contract';

    default:
      return employmentType;
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case 'interested':
      return 'Interested';

    case 'applied':
      return 'Applied';

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

    default:
      return status;
  }
}

function getEmploymentBadgeStyle(
  employmentType: string,
  styles: ReturnType<typeof createStyles>,
) {
  switch (employmentType) {
    case 'full_time':
      return styles.fullTimeBadge;

    case 'contract':
      return styles.contractBadge;

    case 'part_time':
      return styles.partTimeBadge;

    default:
      return styles.defaultBadge;
  }
}

function getEmploymentBadgeTextStyle(
  employmentType: string,
  styles: ReturnType<typeof createStyles>,
) {
  switch (employmentType) {
    case 'full_time':
      return styles.fullTimeText;

    case 'contract':
      return styles.contractText;

    case 'part_time':
      return styles.partTimeText;

    default:
      return styles.defaultBadgeText;
  }
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 24,
      paddingTop: 24,
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

    searchContainer: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 8,
    },

    searchInput: {
      height: 44,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      fontSize: 15,
    },

    listContent: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 100,
    },

    applicationCard: {
      marginBottom: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      backgroundColor: theme.surface,
    },

    applicationCardPressed: {
      backgroundColor: theme.surfaceSecondary,
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    applicationInfo: {
      flex: 1,
      marginRight: 12,
    },

    applicationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },

    company: {
      marginTop: 3,
      fontSize: 14,
      color: theme.textSecondary,
    },

    chevron: {
      fontSize: 26,
      lineHeight: 26,
      color: theme.textMuted,
    },

    metadata: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14,
    },

    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },

    badgeText: {
      fontSize: 11,
      fontWeight: '600',
    },

    fullTimeBadge: {
      backgroundColor: theme.employment.fullTime.background,
    },

    fullTimeText: {
      color: theme.employment.fullTime.text,
    },

    contractBadge: {
      backgroundColor: theme.employment.contract.background,
    },

    contractText: {
      color: theme.employment.contract.text,
    },

    partTimeBadge: {
      backgroundColor: theme.employment.partTime.background,
    },

    partTimeText: {
      color: theme.employment.partTime.text,
    },

    defaultBadge: {
      backgroundColor: theme.surfaceSecondary,
    },

    defaultBadgeText: {
      color: theme.textSecondary,
    },

    statusBadge: {
      marginLeft: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: theme.surfaceSecondary,
    },

    statusText: {
      fontSize: 11,
      fontWeight: '500',
      color: theme.textSecondary,
    },

    spacer: {
      flex: 1,
    },

    date: {
      fontSize: 11,
      color: theme.textMuted,
    },

    location: {
      marginTop: 10,
      fontSize: 12,
      color: theme.textMuted,
    },

    emptyState: {
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingTop: 80,
    },

    emptyTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.text,
    },

    emptyText: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      color: theme.textSecondary,
    },

    addButton: {
      position: 'absolute',
      right: 24,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.text,
      shadowColor: theme.text,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.18,
      shadowRadius: 6,
      elevation: 4,
    },

    addButtonText: {
      marginTop: -2,
      fontSize: 30,
      fontWeight: '300',
      color: theme.background,
    },
  });
}
