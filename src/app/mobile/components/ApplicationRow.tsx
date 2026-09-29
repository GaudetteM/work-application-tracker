import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';
import type { JobApplication } from '../../shared/types';
import { EmploymentBadge } from './EmploymentBadge';

type ApplicationRowProps = {
  application: JobApplication;
  onPress: () => void;
};

export function ApplicationRow({
  application,
  onPress,
}: ApplicationRowProps): React.JSX.Element {
  const { theme } = useTheme();
  const { formatDate } = useDateFormatter();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: theme.border, backgroundColor: theme.surface },
        pressed && { backgroundColor: theme.surfaceSecondary },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: theme.text }]}
            numberOfLines={1}
          >
            {application.title}
          </Text>
          <Text
            style={[styles.company, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {application.company}
          </Text>
        </View>
        <Text style={[styles.chevron, { color: theme.textFaint }]}>›</Text>
      </View>

      <View style={styles.metadata}>
        <EmploymentBadge employmentType={application.employmentType} />
        <View style={styles.spacer} />
        <Text style={[styles.date, { color: theme.textMuted }]}>
          {application.appliedAt
            ? formatDate(application.appliedAt)
            : 'Interested'}
        </Text>
      </View>

      {application.location ? (
        <Text
          style={[styles.location, { color: theme.textMuted }]}
          numberOfLines={1}
        >
          {application.location}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  company: {
    marginTop: 3,
    fontSize: 14,
  },
  chevron: {
    marginLeft: 12,
    fontSize: 24,
    lineHeight: 24,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  spacer: {
    flex: 1,
  },
  date: {
    fontSize: 12,
  },
  location: {
    marginTop: 10,
    fontSize: 12,
  },
});
