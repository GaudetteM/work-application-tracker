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
  JobApplication,
} from '../../../shared/types';

type ApplicationDetailsModalProps = {
  application: JobApplication;
  events: ApplicationEvent[];
  onSave: (application: JobApplication) => void;
  onDelete: () => void;
};

const STATUS_OPTIONS: {
  value: ApplicationStatus;
  label: string;
}[] = [
  { value: 'interested', label: 'Interested' },
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

type EditingField = 'title' | 'company' | 'location' | 'salary' | null;

export function ApplicationDetailsModal({
  application,
  events,
  onSave,
  onDelete,
}: ApplicationDetailsModalProps) {
  const [draft, setDraft] = useState<JobApplication>(application);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateDraft = <K extends keyof JobApplication>(
    field: K,
    value: JobApplication[K],
  ) => {
    setDraft(current => ({
      ...current,
      [field]: value,
    }));
  };

  const finishEditingField = () => {
    if (editingField === 'title' && !draft.title.trim()) {
      return;
    }

    if (editingField === 'company' && !draft.company.trim()) {
      return;
    }

    setDraft(current => ({
      ...current,
      title: current.title.trim(),
      company: current.company.trim(),
      location: current.location?.trim() || undefined,
      salary: current.salary?.trim() || undefined,
    }));

    setEditingField(null);
  };

  const handleClose = () => {
    if (!draft.title.trim() || !draft.company.trim()) {
      return;
    }

    onSave({
      ...draft,
      title: draft.title.trim(),
      company: draft.company.trim(),
      location: draft.location?.trim() || undefined,
      salary: draft.salary?.trim() || undefined,
      notes: draft.notes?.trim() || undefined,
    });
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>APPLICATION</Text>

            <Text style={styles.title}>{draft.title}</Text>

            <Text style={styles.company}>{draft.company}</Text>
          </View>

          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Status</Text>

            <View style={styles.statusOptions}>
              {STATUS_OPTIONS.map(option => (
                <Pressable
                  key={option.value}
                  onPress={() => updateDraft('status', option.value)}
                  style={[
                    styles.statusOption,
                    option.value === draft.status &&
                      styles.statusOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      option.value === draft.status &&
                        styles.statusOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>

            <EditableRow
              label="Title"
              value={draft.title}
              editing={editingField === 'title'}
              onPress={() => setEditingField('title')}
              onChangeText={value => updateDraft('title', value)}
              onDone={finishEditingField}
            />

            <EditableRow
              label="Company"
              value={draft.company}
              editing={editingField === 'company'}
              onPress={() => setEditingField('company')}
              onChangeText={value => updateDraft('company', value)}
              onDone={finishEditingField}
            />

            <EditableRow
              label="Location"
              value={draft.location}
              placeholder="Not specified"
              editing={editingField === 'location'}
              onPress={() => setEditingField('location')}
              onChangeText={value => updateDraft('location', value)}
              onDone={finishEditingField}
            />

            <EditableRow
              label="Salary"
              value={draft.salary}
              placeholder="Not specified"
              editing={editingField === 'salary'}
              onPress={() => setEditingField('salary')}
              onChangeText={value => updateDraft('salary', value)}
              onDone={finishEditingField}
            />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Employment</Text>

              <View style={styles.employmentOptions}>
                <EmploymentButton
                  label="Full-time"
                  selected={draft.employmentType === 'full_time'}
                  onPress={() => updateDraft('employmentType', 'full_time')}
                />

                <EmploymentButton
                  label="Contract"
                  selected={draft.employmentType === 'contract'}
                  onPress={() => updateDraft('employmentType', 'contract')}
                />

                <EmploymentButton
                  label="Part-time"
                  selected={draft.employmentType === 'part_time'}
                  onPress={() => updateDraft('employmentType', 'part_time')}
                />
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Found via</Text>

              <Text style={styles.detailValue}>{draft.listingSource}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Applied through</Text>

              <Text style={styles.detailValue}>{draft.applicationSource}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Applied</Text>

              <Text style={styles.detailValue}>
                {draft.appliedAt
                  ? new Date(draft.appliedAt).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>

            <TextInput
              value={draft.notes ?? ''}
              onChangeText={value => updateDraft('notes', value)}
              style={styles.notesInput}
              placeholder="Company research, impressions, interview notes..."
              placeholderTextColor="#999994"
              multiline
              textAlignVertical="top"
            />
          </View>

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
                        <Text style={styles.timelineNote}>{event.note}</Text>
                      )}
                    </View>
                  </View>
                ))}
            </View>
          </View>

          {confirmDelete ? (
            <View style={styles.deleteConfirmation}>
              <Text style={styles.deleteTitle}>Delete this application?</Text>

              <Text style={styles.deleteText}>
                This will permanently remove the application and its activity
                history.
              </Text>

              <View style={styles.deleteActions}>
                <Pressable
                  onPress={() => setConfirmDelete(false)}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>

                <Pressable onPress={onDelete} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setConfirmDelete(true)}
              style={styles.deleteLink}
            >
              <Text style={styles.deleteLinkText}>Delete Application</Text>
            </Pressable>
          )}

          <View style={styles.actions}>
            <Pressable onPress={handleClose} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Close</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

type EditableRowProps = {
  label: string;
  value?: string;
  placeholder?: string;
  editing: boolean;
  onPress: () => void;
  onChangeText: (value: string) => void;
  onDone: () => void;
};

function EditableRow({
  label,
  value,
  placeholder = 'Not specified',
  editing,
  onPress,
  onChangeText,
  onDone,
}: EditableRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>

      {editing ? (
        <View style={styles.inlineEdit}>
          <TextInput
            autoFocus
            value={value ?? ''}
            onChangeText={onChangeText}
            style={styles.inlineInput}
            placeholder={placeholder}
            placeholderTextColor="#999994"
            onSubmitEditing={onDone}
          />

          <Pressable onPress={onDone} style={styles.inlineDoneButton}>
            <Text style={styles.inlineDoneText}>✓</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={onPress} style={styles.editableValue}>
          <Text style={[styles.detailValue, !value && styles.placeholderValue]}>
            {value || placeholder}
          </Text>

          <Text style={styles.editIndicator}>›</Text>
        </Pressable>
      )}
    </View>
  );
}

type EmploymentButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function EmploymentButton({ label, selected, onPress }: EmploymentButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.employmentButton,
        selected && styles.employmentButtonSelected,
      ]}
    >
      <Text
        style={[
          styles.employmentButtonText,
          selected && styles.employmentButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
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

  sectionTitle: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: '#555550',
  },

  statusSection: {
    marginBottom: 24,
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

  detailsSection: {
    marginBottom: 24,
  },

  detailRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E4',
  },

  detailLabel: {
    flexShrink: 0,
    fontSize: 12,
    color: '#8A8A84',
  },

  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#181816',
    textAlign: 'right',
  },

  placeholderValue: {
    color: '#A0A09A',
  },

  editableValue: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    maxWidth: '70%',
    paddingVertical: 6,
    paddingLeft: 12,
  },

  editIndicator: {
    marginLeft: 12,
    fontSize: 18,
    color: '#A0A09A',
  },

  inlineEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
    gap: 6,
  },

  inlineInput: {
    width: 260,
    height: 34,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#BDBDB7',
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    color: '#181816',
    fontSize: 13,
  },

  inlineDoneButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#181816',
  },

  inlineDoneText: {
    fontSize: 15,
    color: '#FFFFFF',
  },

  employmentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 5,
    maxWidth: '70%',
  },

  employmentButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 6,
    backgroundColor: '#FAFAF8',
  },

  employmentButtonSelected: {
    backgroundColor: '#E8E8E4',
    borderColor: '#BDBDB7',
  },

  employmentButtonText: {
    fontSize: 11,
    color: '#666660',
  },

  employmentButtonTextSelected: {
    fontWeight: '600',
    color: '#181816',
  },

  notesSection: {
    marginBottom: 24,
    borderTopColor: '#E8E8E4',
  },

  notesInput: {
    minHeight: 110,
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#181816',
    fontSize: 13,
    lineHeight: 19,
  },

  timelineSection: {
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

  deleteLink: {
    alignSelf: 'flex-start',
    marginTop: 24,
  },

  deleteLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A33A32',
  },

  deleteConfirmation: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D9B8B4',
    borderRadius: 8,
    backgroundColor: '#FAF1F0',
  },

  deleteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7D2E28',
  },

  deleteText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: '#7D5A56',
  },

  deleteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
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

  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#A33A32',
  },

  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
