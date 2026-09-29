import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { EmploymentType } from '../../shared/types';

type EmploymentBadgeProps = {
  employmentType: EmploymentType;
};

const labels: Record<EmploymentType, string> = {
  full_time: 'Full-time',
  contract: 'Contract',
  part_time: 'Part-time',
};

export function EmploymentBadge({
  employmentType,
}: EmploymentBadgeProps): React.JSX.Element {
  const { theme } = useTheme();

  const colors =
    employmentType === 'full_time'
      ? theme.employment.fullTime
      : employmentType === 'contract'
      ? theme.employment.contract
      : theme.employment.partTime;

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {labels[employmentType]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
