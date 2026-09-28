import React, { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { formatStatus } from '../../shared/utils/applicationFormatter';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';
import type { ApplicationStatus, JobApplication } from '../../shared/types';

import { useTheme } from '../../shared/theme/ThemeProvider';
import type { MobileStackParamList } from '../navigation/MobileNavigator';

type Props = NativeStackScreenProps<MobileStackParamList, 'ApplicationDetails'>;

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

export function ApplicationDetailsScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const applications = useApplicationStore(state => state.applications);
  const events = useApplicationStore(state => state.events);
  const saveApplication = useApplicationStore(state => state.saveApplication);
  const deleteApplication = useApplicationStore(
    state => state.deleteApplication,
  );

  const application = applications.find(
    item => item.id === route.params.applicationId,
  );

  const applicationEvents = events
    .filter(event => event.applicationId === route.params.applicationId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const { formatDate } = useDateFormatter();

  const [draft, setDraft] = useState<JobApplication | null>(
    application ?? null,
  );
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!application || !draft) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.headerBar,
            {
              paddingTop: insets.top,
            },
          ]}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹ Back</Text>
          </Pressable>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Application not found</Text>
        </View>
      </View>
    );
  }

  const updateDraft = <K extends keyof JobApplication>(
    field: K,
    value: JobApplication[K],
  ) => {
    setDraft(current => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const finishEditingField = () => {
    if (editingField === 'title' && !draft.title.trim()) {
      return;
    }

    if (editingField === 'company' && !draft.company.trim()) {
      return;
    }

    setDraft(current => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        title: current.title.trim(),
        company: current.company.trim(),
        location: current.location?.trim() || undefined,
        salary: current.salary?.trim() || undefined,
      };
    });

    setEditingField(null);
  };

  const handleSave = () => {
    if (!draft.title.trim() || !draft.company.trim()) {
      return;
    }

    saveApplication(
      {
        ...draft,
        title: draft.title.trim(),
        company: draft.company.trim(),
        location: draft.location?.trim() || undefined,
        salary: draft.salary?.trim() || undefined,
        notes: draft.notes?.trim() || undefined,
      },
      application.status,
    );

    navigation.goBack();
  };

  const handleDelete = () => {
    deleteApplication(application.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Text style={styles.backButtonText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Application</Text>

        <Pressable
          onPress={handleSave}
          disabled={!draft.title.trim() || !draft.company.trim()}
          style={styles.headerButton}
        >
          <Text
            style={[
              styles.saveButtonText,
              (!draft.title.trim() || !draft.company.trim()) &&
                styles.saveButtonDisabled,
            ]}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 40,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>APPLICATION</Text>
          <Text style={styles.title}>{draft.title}</Text>
          <Text style={styles.company}>{draft.company}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>

          <View style={styles.statusOptions}>
            {STATUS_OPTIONS.map(option => {
              const selected = option.value === draft.status;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => updateDraft('status', option.value)}
                  style={[
                    styles.statusOption,
                    selected && styles.statusOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      selected && styles.statusOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <EditableRow
            label="Title"
            value={draft.title}
            editing={editingField === 'title'}
            onPress={() => setEditingField('title')}
            onChangeText={value => updateDraft('title', value)}
            onDone={finishEditingField}
            theme={theme}
            styles={styles}
          />

          <EditableRow
            label="Company"
            value={draft.company}
            editing={editingField === 'company'}
            onPress={() => setEditingField('company')}
            onChangeText={value => updateDraft('company', value)}
            onDone={finishEditingField}
            theme={theme}
            styles={styles}
          />

          <EditableRow
            label="Location"
            value={draft.location}
            placeholder="Not specified"
            editing={editingField === 'location'}
            onPress={() => setEditingField('location')}
            onChangeText={value => updateDraft('location', value)}
            onDone={finishEditingField}
            theme={theme}
            styles={styles}
          />

          <EditableRow
            label="Salary"
            value={draft.salary}
            placeholder="Not specified"
            editing={editingField === 'salary'}
            onPress={() => setEditingField('salary')}
            onChangeText={value => updateDraft('salary', value)}
            onDone={finishEditingField}
            theme={theme}
            styles={styles}
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

          <DetailRow
            label="Found via"
            value={draft.listingSource}
            styles={styles}
          />

          <DetailRow
            label="Applied through"
            value={draft.applicationSource}
            styles={styles}
          />

          <DetailRow
            label="Applied"
            value={draft.appliedAt ? formatDate(draft.appliedAt) : 'N/A'}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
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

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Activity</Text>

          {applicationEvents.length === 0 ? (
            <Text style={styles.emptyActivity}>No activity recorded yet.</Text>
          ) : (
            <View style={styles.timeline}>
              {applicationEvents.map((event, index) => (
                <View key={event.id} style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <View style={styles.timelineDot} />

                    {index < applicationEvents.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>

                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStatus}>
                      {formatStatus(event.status)}
                    </Text>

                    <Text style={styles.timelineDate}>
                      {formatDate(event.createdAt)}
                    </Text>

                    {event.note ? (
                      <Text style={styles.timelineNote}>{event.note}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          )}
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

              <Pressable onPress={handleDelete} style={styles.deleteButton}>
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
      </ScrollView>
    </View>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
};

function DetailRow({
  label,
  value,
  styles,
}: DetailRowProps): React.JSX.Element {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  theme: ReturnType<typeof useTheme>['theme'];
  styles: ReturnType<typeof createStyles>;
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
}: EditableRowProps): React.JSX.Element {
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
            placeholderTextColor={styles.placeholderValue.color}
            onSubmitEditing={onDone}
            returnKeyType="done"
          />

          <Pressable onPress={onDone} style={styles.inlineDoneButton}>
            <Text style={styles.inlineDoneText}>✓</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={onPress} style={styles.editableValue}>
          <Text
            style={[styles.detailValue, !value && styles.placeholderValue]}
            numberOfLines={3}
          >
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
}: EmploymentButtonProps): React.JSX.Element {
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

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    headerBar: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },

    headerButton: {
      minWidth: 60,
      paddingVertical: 8,
    },

    backButtonText: {
      fontSize: 16,
      color: theme.textSecondary,
    },

    backButton: {
      minWidth: 60,
      paddingVertical: 8,
    },

    headerTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
    },

    saveButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.accent,
      textAlign: 'right',
    },

    saveButtonDisabled: {
      color: theme.textFaint,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },

    hero: {
      marginBottom: 28,
    },

    eyebrow: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: theme.textMuted,
    },

    title: {
      marginTop: 5,
      fontSize: 26,
      fontWeight: '700',
      lineHeight: 32,
      color: theme.text,
    },

    company: {
      marginTop: 5,
      fontSize: 17,
      color: theme.textSecondary,
    },

    section: {
      marginBottom: 28,
    },

    sectionTitle: {
      marginBottom: 12,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
      color: theme.textSecondary,
    },

    statusOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    statusOption: {
      paddingHorizontal: 11,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 7,
      backgroundColor: theme.surfaceSecondary,
    },

    statusOptionSelected: {
      borderColor: theme.borderStrong,
      backgroundColor: theme.border,
    },

    statusOptionText: {
      fontSize: 12,
      color: theme.textSecondary,
    },

    statusOptionTextSelected: {
      fontWeight: '600',
      color: theme.text,
    },

    detailRow: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },

    detailLabel: {
      flexShrink: 0,
      fontSize: 13,
      color: theme.textMuted,
    },

    detailValue: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: theme.text,
      textAlign: 'right',
    },

    placeholderValue: {
      color: theme.textMuted,
    },

    editableValue: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 6,
      paddingVertical: 8,
      paddingLeft: 12,
    },

    editIndicator: {
      marginLeft: 4,
      fontSize: 20,
      color: theme.textFaint,
    },

    inlineEdit: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 6,
      paddingLeft: 12,
    },

    inlineInput: {
      flex: 1,
      minWidth: 0,
      height: 38,
      paddingHorizontal: 9,
      borderWidth: 1,
      borderColor: theme.borderStrong,
      borderRadius: 7,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      fontSize: 14,
    },

    inlineDoneButton: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7,
      backgroundColor: theme.accent,
    },

    inlineDoneText: {
      fontSize: 16,
      color: theme.accentText,
    },

    employmentOptions: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      gap: 5,
      paddingVertical: 6,
    },

    employmentButton: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 6,
      backgroundColor: theme.surfaceSecondary,
    },

    employmentButtonSelected: {
      borderColor: theme.borderStrong,
      backgroundColor: theme.border,
    },

    employmentButtonText: {
      fontSize: 11,
      color: theme.textSecondary,
    },

    employmentButtonTextSelected: {
      fontWeight: '600',
      color: theme.text,
    },

    notesInput: {
      minHeight: 130,
      paddingHorizontal: 11,
      paddingTop: 10,
      paddingBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      fontSize: 14,
      lineHeight: 20,
    },

    activitySection: {
      paddingTop: 20,
      marginBottom: 28,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
    },

    timeline: {
      marginTop: 2,
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
      fontSize: 14,
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
      lineHeight: 18,
      color: theme.textSecondary,
    },

    emptyActivity: {
      fontSize: 13,
      color: theme.textMuted,
    },

    deleteLink: {
      alignSelf: 'flex-start',
      paddingVertical: 8,
    },

    deleteLinkText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#A33A32',
    },

    deleteConfirmation: {
      padding: 16,
      borderWidth: 1,
      borderColor: '#D9B8B4',
      borderRadius: 8,
      backgroundColor: '#FAF1F0',
    },

    deleteTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#7D2E28',
    },

    deleteText: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 19,
      color: '#7D5A56',
    },

    deleteActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 14,
    },

    secondaryButton: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.surfaceSecondary,
    },

    secondaryButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
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

    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
  });
}
