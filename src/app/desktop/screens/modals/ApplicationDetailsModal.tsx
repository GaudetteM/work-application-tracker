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
import { formatStatus } from '../../../shared/utils/applicationFormatter';
import { useDateFormatter } from '../../../shared/utils/useDateFormatter';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import type { Theme } from '../../../shared/theme/theme';

type ApplicationDetailsModalProps = {
  application: JobApplication;
  events: ApplicationEvent[];
  onSave: (application: JobApplication) => void;
  onDelete: () => void;
  onClose: () => void;
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

type EditingField =
  | 'title'
  | 'company'
  | 'location'
  | 'salary'
  | 'listingSource'
  | 'applicationSource'
  | 'appliedAt'
  | null;

export function ApplicationDetailsModal({
  application,
  events,
  onSave,
  onDelete,
  onClose,
}: ApplicationDetailsModalProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { formatDate, parseDateInput } = useDateFormatter();

  const [draft, setDraft] = useState<JobApplication>(application);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [appliedAtText, setAppliedAtText] = useState('');
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

  const handleStatusChange = (status: ApplicationStatus) => {
    setDraft(current => {
      let appliedAt = current.appliedAt;

      if (status === 'applied' && !appliedAt) {
        appliedAt = new Date().toISOString();
      }

      if (status === 'interested') {
        appliedAt = undefined;
      }

      return { ...current, status, appliedAt };
    });
  };

  const finishEditingAppliedAt = () => {
    const parsed = parseDateInput(appliedAtText);

    if (parsed) {
      updateDraft('appliedAt', parsed.toISOString());
    }

    setEditingField(null);
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

  const canSave = draft.title.trim() !== '' && draft.company.trim() !== '';

  const handleSave = () => {
    if (!canSave) {
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

          <Pressable onPress={onClose} style={styles.closeButton}>
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
                  onPress={() => handleStatusChange(option.value)}
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
              styles={styles}
              theme={theme}
            />

            <EditableRow
              label="Company"
              value={draft.company}
              editing={editingField === 'company'}
              onPress={() => setEditingField('company')}
              onChangeText={value => updateDraft('company', value)}
              onDone={finishEditingField}
              styles={styles}
              theme={theme}
            />

            <EditableRow
              label="Location"
              value={draft.location}
              placeholder="Not specified"
              editing={editingField === 'location'}
              onPress={() => setEditingField('location')}
              onChangeText={value => updateDraft('location', value)}
              onDone={finishEditingField}
              styles={styles}
              theme={theme}
            />

            <EditableRow
              label="Salary"
              value={draft.salary}
              placeholder="Not specified"
              editing={editingField === 'salary'}
              onPress={() => setEditingField('salary')}
              onChangeText={value => updateDraft('salary', value)}
              onDone={finishEditingField}
              styles={styles}
              theme={theme}
            />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Employment</Text>

              <View style={styles.employmentOptions}>
                <EmploymentButton
                  label="Full-time"
                  selected={draft.employmentType === 'full_time'}
                  onPress={() => updateDraft('employmentType', 'full_time')}
                  styles={styles}
                />

                <EmploymentButton
                  label="Contract"
                  selected={draft.employmentType === 'contract'}
                  onPress={() => updateDraft('employmentType', 'contract')}
                  styles={styles}
                />

                <EmploymentButton
                  label="Part-time"
                  selected={draft.employmentType === 'part_time'}
                  onPress={() => updateDraft('employmentType', 'part_time')}
                  styles={styles}
                />
              </View>
            </View>

            <EditableRow
              label="Found via"
              value={draft.listingSource}
              editing={editingField === 'listingSource'}
              onPress={() => setEditingField('listingSource')}
              onChangeText={value => updateDraft('listingSource', value)}
              onDone={finishEditingField}
              styles={styles}
              theme={theme}
            />

            {draft.status !== 'interested' ? (
              <EditableRow
                label="Applied through"
                value={draft.applicationSource}
                editing={editingField === 'applicationSource'}
                onPress={() => setEditingField('applicationSource')}
                onChangeText={value => updateDraft('applicationSource', value)}
                onDone={finishEditingField}
                styles={styles}
                theme={theme}
              />
            ) : null}

            {draft.appliedAt ? (
              <EditableRow
                label="Applied"
                value={
                  editingField === 'appliedAt'
                    ? appliedAtText
                    : formatDate(draft.appliedAt)
                }
                editing={editingField === 'appliedAt'}
                onPress={() => {
                  setAppliedAtText(formatDate(draft.appliedAt as string));
                  setEditingField('appliedAt');
                }}
                onChangeText={setAppliedAtText}
                onDone={finishEditingAppliedAt}
                styles={styles}
                theme={theme}
              />            ) : null}
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>

            <TextInput
              value={draft.notes ?? ''}
              onChangeText={value => updateDraft('notes', value)}
              style={styles.notesInput}
              placeholder="Company research, impressions, interview notes..."
              placeholderTextColor={theme.textMuted}
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
            <Pressable onPress={onClose} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              style={[styles.primaryButton, !canSave && styles.primaryButtonDisabled]}
            >
              <Text style={styles.primaryButtonText}>Save</Text>
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
  styles: ReturnType<typeof createStyles>;
  theme: Theme;
};

function EditableRow({
  label,
  value,
  placeholder = 'Not specified',
  editing,
  onPress,
  onChangeText,
  onDone,
  styles,
  theme,
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
            placeholderTextColor={theme.textMuted}
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
  styles: ReturnType<typeof createStyles>;
};

function EmploymentButton({
  label,
  selected,
  onPress,
  styles,
}: EmploymentButtonProps) {
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

function createStyles(theme: Theme) {
  return StyleSheet.create({
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
      borderColor: theme.border,
      borderRadius: 12,
      backgroundColor: theme.surface,
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
      borderBottomColor: theme.border,
    },

    headerText: {
      flex: 1,
      minWidth: 0,
    },

    eyebrow: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: theme.textMuted,
    },

    title: {
      marginTop: 4,
      fontSize: 21,
      fontWeight: '700',
      color: theme.text,
    },

    company: {
      marginTop: 4,
      fontSize: 13,
      color: theme.textSecondary,
    },

    closeButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 16,
      borderRadius: 7,
      backgroundColor: theme.surfaceSecondary,
    },

    closeButtonText: {
      marginTop: -2,
      fontSize: 24,
      fontWeight: '300',
      color: theme.textSecondary,
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
      color: theme.textSecondary,
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
      borderColor: theme.border,
      borderRadius: 7,
      backgroundColor: theme.inputBackground,
    },

    statusOptionSelected: {
      backgroundColor: theme.surfaceSecondary,
      borderColor: theme.borderStrong,
    },

    statusOptionText: {
      fontSize: 12,
      color: theme.textSecondary,
    },

    statusOptionTextSelected: {
      fontWeight: '600',
      color: theme.text,
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
      borderBottomColor: theme.border,
    },

    detailLabel: {
      flexShrink: 0,
      fontSize: 12,
      color: theme.textMuted,
    },

    detailValue: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      textAlign: 'right',
    },

    placeholderValue: {
      color: theme.textFaint,
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
      color: theme.textFaint,
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
      borderColor: theme.borderStrong,
      borderRadius: 7,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      fontSize: 13,
    },

    inlineDoneButton: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      backgroundColor: theme.accent,
    },

    inlineDoneText: {
      fontSize: 15,
      color: theme.accentText,
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
      borderColor: theme.border,
      borderRadius: 6,
      backgroundColor: theme.inputBackground,
    },

    employmentButtonSelected: {
      backgroundColor: theme.surfaceSecondary,
      borderColor: theme.borderStrong,
    },

    employmentButtonText: {
      fontSize: 11,
      color: theme.textSecondary,
    },

    employmentButtonTextSelected: {
      fontWeight: '600',
      color: theme.text,
    },

    notesSection: {
      marginBottom: 24,
      borderTopColor: theme.border,
    },

    notesInput: {
      minHeight: 110,
      paddingHorizontal: 11,
      paddingTop: 10,
      paddingBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      fontSize: 13,
      lineHeight: 19,
    },

    timelineSection: {
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
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
      backgroundColor: theme.textSecondary,
    },

    timelineLine: {
      flex: 1,
      width: 1,
      marginTop: 4,
      marginBottom: -4,
      backgroundColor: theme.border,
    },

    timelineContent: {
      flex: 1,
      paddingLeft: 8,
      paddingBottom: 18,
    },

    timelineStatus: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.text,
    },

    timelineDate: {
      marginTop: 3,
      fontSize: 12,
      color: theme.textMuted,
    },

    timelineNote: {
      marginTop: 5,
      fontSize: 12,
      color: theme.textSecondary,
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
      borderTopColor: theme.border,
    },

    secondaryButton: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
    },

    secondaryButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
    },

    primaryButton: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 8,
      backgroundColor: theme.accent,
    },

    primaryButtonDisabled: {
      opacity: 0.5,
    },

    primaryButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.accentText,
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
}

