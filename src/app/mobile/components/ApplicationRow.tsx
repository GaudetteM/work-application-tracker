import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { JobApplication } from '../../shared/types';
import { formatStatus } from '../../shared/utils/applicationFormatter';
import { EmploymentBadge } from './EmploymentBadge';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';

type ApplicationRowProps = {
  application: JobApplication;
  onPress: () => void;
  index: number;
};

export function ApplicationRow({
  application,
  onPress,
  index,
}: ApplicationRowProps) {
  const { theme } = useTheme();
  const { formatDate } = useDateFormatter();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor:
            index % 2 === 0 ? theme.surfaceSecondary : theme.surface,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.main}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
              },
            ]}
          >
            {application.title}
          </Text>

          <EmploymentBadge employmentType={application.employmentType} />
        </View>

        <Text
          style={[
            styles.company,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {application.company}
        </Text>

        <View style={styles.metaRow}>
          <Text
            style={[
              styles.meta,
              {
                color: theme.textMuted,
              },
            ]}
          >
            {application.listingSource}
          </Text>

          {application.listingSource !== '' &&
            application.applicationSource !== '' && (
              <Text
                style={[
                  styles.separator,
                  {
                    color: theme.textFaint,
                  },
                ]}
              >
                →
              </Text>
            )}
          <Text
            style={[
              styles.meta,
              {
                color: theme.textMuted,
              },
            ]}
          >
            {application.applicationSource}
          </Text>

          <Text
            style={[
              styles.separator,
              {
                color: theme.textFaint,
              },
            ]}
          >
            ·
          </Text>

          <Text
            style={[
              styles.meta,
              {
                color: theme.textMuted,
              },
            ]}
          >
            {application.appliedAt ? formatDate(application.appliedAt) : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        {application.salary && (
          <Text
            style={[
              styles.salary,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {application.salary}
          </Text>
        )}

        <View
          style={[
            styles.status,
            {
              backgroundColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {formatStatus(application.status)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
  },

  company: {
    marginTop: 5,
    fontSize: 13,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },

  meta: {
    fontSize: 12,
  },

  separator: {
    marginHorizontal: 7,
    fontSize: 12,
  },

  right: {
    alignItems: 'flex-end',
    marginLeft: 24,
  },

  salary: {
    marginBottom: 7,
    fontSize: 12,
  },

  status: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
