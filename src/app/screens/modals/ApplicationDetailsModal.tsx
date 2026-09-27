import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  ApplicationEvent,
  ApplicationStatus,
  EmploymentType,
  JobApplication,
} from '../../types';
import { EmploymentTypeButton } from '../../components';

type ApplicationDetailsModalProps = {
  application: JobApplication;
  events: ApplicationEvent[];
  onClose: () => void;
  onSave: (application: JobApplication) => void;
  onStatusChange: (status: ApplicationStatus) => void;
};

const STATUS_OPTIONS: {
  value: ApplicationStatus;
  label: string;
}[] = [
  { value: 'applied', label: 'Applied' },
  {
    value: 'recruiter_contact',
    label: 'Recruiter Contact',
  },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'closed', label: 'Closed' },
];

export function ApplicationDetailsModal({
  application,
  events,
  onClose,
  onSave,
  onStatusChange,
}: ApplicationDetailsModalProps) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(application.title);
  const [company, setCompany] = useState(application.company);
  const [location, setLocation] = useState(application.location ?? '');
  const [salary, setSalary] = useState(application.salary ?? '');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    application.employmentType,
  );
  const [notes, setNotes] = useState(application.notes ?? '');

  const save = () => {
    if (!title.trim() || !company.trim()) {
      return;
    }

    const updatedApplication: JobApplication = {
      ...application,
      title: title.trim(),
      company: company.trim(),
      location: location.trim() || undefined,
      salary: salary.trim() || undefined,
      employmentType,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedApplication);
    setEditing(false);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>APPLICATION</Text>

            <Text style={styles.title}>{application.title}</Text>

            <Text style={styles.company}>{application.company}</Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {editing ? (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Title</Text>

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                  placeholder="Job title"
                  placeholderTextColor="#999994"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Company</Text>

                <TextInput
                  value={company}
                  onChangeText={setCompany}
                  style={styles.input}
                  placeholder="Company"
                  placeholderTextColor="#999994"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Location</Text>

                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  style={styles.input}
                  placeholder="Remote, Minneapolis, etc."
                  placeholderTextColor="#999994"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Salary</Text>

                <TextInput
                  value={salary}
                  onChangeText={setSalary}
                  style={styles.input}
                  placeholder="$120k–$145k"
                  placeholderTextColor="#999994"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Employment Type</Text>

                <View style={styles.employmentOptions}>
                  <EmploymentTypeButton
                    label="Full-time"
                    selected={employmentType === 'full_time'}
                    onPress={() => setEmploymentType('full_time')}
                  />

                  <EmploymentTypeButton
                    label="Contract"
                    selected={employmentType === 'contract'}
                    onPress={() => setEmploymentType('contract')}
                  />

                  <EmploymentTypeButton
                    label="Part-time"
                    selected={employmentType === 'part_time'}
                    onPress={() => setEmploymentType('part_time')}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Notes</Text>

                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  style={[styles.input, styles.notesInput]}
                  placeholder="Company research, impressions, etc."
                  placeholderTextColor="#999994"
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => setEditing(false)}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>

                <Pressable onPress={save} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Save Changes</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Details</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>

                  <Text style={styles.detailValue}>
                    {application.location || 'Not specified'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Salary</Text>

                  <Text style={styles.detailValue}>
                    {application.salary || 'Not specified'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Employment</Text>

                  <Text style={styles.detailValue}>
                    {formatEmploymentType(application.employmentType)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Found via</Text>

                  <Text style={styles.detailValue}>
                    {application.listingSource}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Applied through</Text>

                  <Text style={styles.detailValue}>
                    {application.applicationSource}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Applied</Text>

                  <Text style={styles.detailValue}>
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.sectionTitle}>Status</Text>

                <View style={styles.statusOptions}>
                  {STATUS_OPTIONS.map(status => (
                    <Pressable
                      key={status.value}
                      onPress={() => {
                        if (status.value !== application.status) {
                          onStatusChange(status.value);
                        }
                      }}
                      style={[
                        styles.statusOption,
                        status.value === application.status &&
                          styles.statusOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          status.value === application.status &&
                            styles.statusOptionTextSelected,
                        ]}
                      >
                        {status.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {application.notes && (
                <View style={styles.notesSection}>
                  <Text style={styles.sectionTitle}>Notes</Text>

                  <Text style={styles.notesText}>{application.notes}</Text>
                </View>
              )}

              <View style={styles.timelineSection}>
                <Text style={styles.sectionTitle}>Activity</Text>

                <View style={styles.timeline}>
                  {[...events]
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )
                    .map((event, index, sortedEvents) => (
                      <View key={event.id} style={styles.timelineItem}>
                        <View style={styles.timelineMarker}>
                          <View style={styles.timelineDot} />

                          {index < sortedEvents.length - 1 && (
                            <View style={styles.timelineLine} />
                          )}
                        </View>

                        <View style={styles.timelineContent}>
                          <Text style={styles.timelineStatus}>
                            {formatStatus(event.status)}
                          </Text>

                          <Text style={styles.timelineDate}>
                            {new Date(event.createdAt).toLocaleDateString()}
                          </Text>

                          {event.note && (
                            <Text style={styles.timelineNote}>
                              {event.note}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => setEditing(true)}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Edit</Text>
                </Pressable>

                <Pressable onPress={onClose} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Close</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
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

function formatEmploymentType(type: EmploymentType) {
  switch (type) {
    case 'contract':
      return 'Contract';

    case 'part_time':
      return 'Part-time';

    case 'full_time':
    default:
      return 'Full-time';
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  modal: {
    width: 680,
    maxHeight: '88%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 12,
    backgroundColor: '#F7F7F5',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E0',
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#999994',
  },

  title: {
    marginTop: 4,
    fontSize: 21,
    fontWeight: '700',
    color: '#181816',
  },

  company: {
    marginTop: 4,
    fontSize: 13,
    color: '#666660',
  },

  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    borderRadius: 7,
    backgroundColor: '#E8E8E4',
  },

  closeButtonText: {
    marginTop: -2,
    fontSize: 24,
    fontWeight: '300',
    color: '#555550',
  },

  content: {
    flexGrow: 0,
  },

  contentContainer: {
    padding: 24,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: '600',
    color: '#555550',
  },

  input: {
    height: 40,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#181816',
    fontSize: 14,
  },

  notesInput: {
    height: 120,
    paddingTop: 10,
  },

  employmentOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  detailsSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: '#555550',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E4',
  },

  detailLabel: {
    fontSize: 12,
    color: '#8A8A84',
  },

  detailValue: {
    maxWidth: '65%',
    fontSize: 13,
    color: '#252522',
    textAlign: 'right',
  },

  statusSection: {
    marginTop: 20,
  },

  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  statusOption: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 7,
    backgroundColor: '#FAFAF8',
  },

  statusOptionSelected: {
    backgroundColor: '#E8E8E4',
    borderColor: '#BDBDB7',
  },

  statusOptionText: {
    fontSize: 12,
    color: '#666660',
  },

  statusOptionTextSelected: {
    fontWeight: '600',
    color: '#181816',
  },

  notesSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E4',
  },

  notesText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#555550',
  },

  timelineSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E4',
  },

  timeline: {
    marginTop: 4,
  },

  timelineItem: {
    flexDirection: 'row',
  },

  timelineMarker: {
    width: 20,
    alignItems: 'center',
  },

  timelineDot: {
    width: 8,
    height: 8,
    marginTop: 5,
    borderRadius: 4,
    backgroundColor: '#555550',
  },

  timelineLine: {
    flex: 1,
    width: 1,
    marginTop: 4,
    marginBottom: -4,
    backgroundColor: '#D9D9D5',
  },

  timelineContent: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 18,
  },

  timelineStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#252522',
  },

  timelineDate: {
    marginTop: 3,
    fontSize: 12,
    color: '#8A8A84',
  },

  timelineNote: {
    marginTop: 5,
    fontSize: 12,
    color: '#666660',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E4',
  },

  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FAFAF8',
  },

  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555550',
  },

  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#181816',
  },

  primaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
