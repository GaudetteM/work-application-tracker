import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EmploymentType } from '../types/application';

type EmploymentBadgeProps = {
  employmentType: EmploymentType;
};

const labels: Record<EmploymentType, string> = {
  full_time: 'Full-time',
  contract: 'Contract',
  part_time: 'Part-time',
};

export function EmploymentBadge({ employmentType }: EmploymentBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{labels[employmentType]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E8E8E4',
  },

  text: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555550',
  },
});
