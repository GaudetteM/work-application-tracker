import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EmploymentBadge } from './EmploymentBadge';
import { JobApplication } from '../types/application';

type ApplicationRowProps = {
  application: JobApplication;
  onPress: () => void;
};

export function ApplicationRow({ application, onPress }: ApplicationRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.main}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{application.title}</Text>

          <EmploymentBadge employmentType={application.employmentType} />
        </View>

        <Text style={styles.company}>{application.company}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{application.listingSource}</Text>

          <Text style={styles.separator}>→</Text>

          <Text style={styles.meta}>{application.applicationSource}</Text>

          <Text style={styles.separator}>·</Text>

          <Text style={styles.meta}>
            {new Date(application.appliedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        {application.salary && (
          <Text style={styles.salary}>{application.salary}</Text>
        )}

        <View style={styles.status}>
          <Text style={styles.statusText}>
            {formatStatus(application.status)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function formatStatus(status: JobApplication['status']) {
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

const styles = StyleSheet.create({
  row: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E3',
    backgroundColor: '#F7F7F5',
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
    color: '#20201D',
  },

  company: {
    marginTop: 5,
    fontSize: 13,
    color: '#666660',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },

  meta: {
    fontSize: 12,
    color: '#8A8A84',
  },

  separator: {
    marginHorizontal: 7,
    fontSize: 12,
    color: '#B0B0AA',
  },

  right: {
    alignItems: 'flex-end',
    marginLeft: 24,
  },

  salary: {
    marginBottom: 7,
    fontSize: 12,
    color: '#666660',
  },

  status: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E8E8E4',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555550',
  },
});
