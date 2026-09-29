import { StyleSheet, Text, View } from 'react-native';
import { JobApplication } from '../../shared/types';
import { formatStatus } from '../../shared/utils/applicationFormatter';
import { useTheme } from '../../shared/theme/ThemeProvider';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';

export function ApplicationSummary({
  application,
}: {
  application: JobApplication;
}) {
  const { theme } = useTheme();
  const { formatDate } = useDateFormatter();

  return (
    <View style={styles.applicationRow}>
      <View style={styles.applicationMain}>
        <Text
          style={[
            styles.applicationTitle,
            {
              color: theme.text,
            },
          ]}
          numberOfLines={1}
        >
          {application.title}
        </Text>

        <Text
          style={[
            styles.applicationCompany,
            {
              color: theme.textMuted,
            },
          ]}
        >
          {application.company}
        </Text>
      </View>

      <View style={styles.applicationMeta}>
        <Text
          style={[
            styles.applicationStatus,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {formatStatus(application.status)}
        </Text>

        <Text
          style={[
            styles.applicationDate,
            {
              color: theme.textFaint,
            },
          ]}
        >
          {application.appliedAt ? formatDate(application.appliedAt) : 'N/A'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  applicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 58,
    borderBottomWidth: 1,
  },

  applicationMain: {
    flex: 1,
    minWidth: 0,
    paddingRight: 16,
  },

  applicationTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  applicationCompany: {
    marginTop: 3,
    fontSize: 12,
  },

  applicationMeta: {
    alignItems: 'flex-end',
  },

  applicationStatus: {
    fontSize: 11,
    fontWeight: '600',
  },

  applicationDate: {
    marginTop: 3,
    fontSize: 11,
  },
});

