import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditableRow, EmploymentButton } from '../components';
import { useApplicationStore } from '../../shared/store/ApplicationStore';
import type {
  ApplicationStatus,
  EmploymentType,
  JobApplication,
} from '../../shared/types';
import { formatStatus } from '../../shared/utils/applicationFormatter';
import { useDateFormatter } from '../../shared/utils/useDateFormatter';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { Theme } from '../../shared/theme/theme';
import type { MobileStackParamList } from '../navigation/MobileNavigator';
type Props = NativeStackScreenProps<MobileStackParamList, 'ApplicationDetails'>;
const STATUS_OPTIONS: ApplicationStatus[] = [
  'interested',
  'applied',
  'recruiter_contact',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
  'closed',
];
export function ApplicationDetailsScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const application = useApplicationStore(state =>
    state.applications.find(item => item.id === route.params.applicationId),
  );
  const allEvents = useApplicationStore(state => state.events);

  const events = useMemo(
    () =>
      allEvents
        .filter(event => event.applicationId === route.params.applicationId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [allEvents, route.params.applicationId],
  );
  const saveApplication = useApplicationStore(state => state.saveApplication);
  const deleteApplication = useApplicationStore(
    state => state.deleteApplication,
  );
  const { formatDate } = useDateFormatter();
  const [draft, setDraft] = useState<JobApplication | null>(
    application ?? null,
  );
  const [editingField, setEditingField] = useState<
    | 'title'
    | 'company'
    | 'location'
    | 'salary'
    | 'listingSource'
    | 'applicationSource'
    | 'appliedAt'
    | null
  >(null);
  const [appliedAtText, setAppliedAtText] = useState('');
  if (!draft) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.missingContainer}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.missingTitle}> Application not found </Text>
        </View>
      </SafeAreaView>
    );
  }
  const updateDraft = (
    field: keyof JobApplication,
    value: string | EmploymentType,
  ) => {
    setDraft(current => {
      if (!current) {
        return current;
      }
      return { ...current, [field]: value };
    });
  };
  const finishEditingField = () => {
    setEditingField(null);
  };
  const finishEditingAppliedAt = () => {
    const parsed = new Date(appliedAtText);
    if (!Number.isNaN(parsed.getTime())) {
      updateDraft('appliedAt', parsed.toISOString());
    }
    setEditingField(null);
  };
  const handleSave = () => {
    saveApplication(draft, application?.status ?? draft.status);
    navigation.goBack();
  };
  const handleDelete = () => {
    Alert.alert(
      'Delete this application?',
      'This will permanently remove the application and its activity history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteApplication(draft.id);
            navigation.goBack();
          },
        },
      ],
    );
  };
  const handleStatusChange = (status: ApplicationStatus) => {
    setDraft(current => {
      if (!current) {
        return current;
      }
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Application</Text>
        <Pressable onPress={handleSave} style={styles.headerButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>APPLICATION</Text>
          <Text style={styles.title}> {draft.title} </Text>
          <Text style={styles.company}> {draft.company} </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusGrid}>
            {STATUS_OPTIONS.map(status => {
              const selected = draft.status === status;
              return (
                <Pressable
                  key={status}
                  onPress={() => handleStatusChange(status)}
                  style={[
                    styles.statusButton,
                    selected && styles.statusButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      selected && styles.statusButtonTextSelected,
                    ]}
                  >
                    {formatStatus(status)}
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
            onStartEditing={() => setEditingField('title')}
            onChangeText={value => updateDraft('title', value)}
            onFinishEditing={finishEditingField}
          />
          <EditableRow
            label="Company"
            value={draft.company}
            editing={editingField === 'company'}
            onStartEditing={() => setEditingField('company')}
            onChangeText={value => updateDraft('company', value)}
            onFinishEditing={finishEditingField}
          />
          <EditableRow
            label="Location"
            value={draft.location ?? ''}
            editing={editingField === 'location'}
            onStartEditing={() => setEditingField('location')}
            onChangeText={value => updateDraft('location', value)}
            onFinishEditing={finishEditingField}
            placeholder="Not specified"
          />
          <EditableRow
            label="Salary"
            value={draft.salary ?? ''}
            editing={editingField === 'salary'}
            onStartEditing={() => setEditingField('salary')}
            onChangeText={value => updateDraft('salary', value)}
            onFinishEditing={finishEditingField}
            placeholder="Not specified"
          />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Employment</Text>
            <View style={styles.employmentOptions}>
              {(['full_time', 'contract', 'part_time'] as EmploymentType[]).map(
                type => (
                  <EmploymentButton
                    key={type}
                    type={type}
                    selected={draft.employmentType === type}
                    onPress={() => updateDraft('employmentType', type)}
                  />
                ),
              )}
            </View>
          </View>
          <EditableRow
            label="Found via"
            value={draft.listingSource}
            editing={editingField === 'listingSource'}
            onStartEditing={() => setEditingField('listingSource')}
            onChangeText={value => updateDraft('listingSource', value)}
            onFinishEditing={finishEditingField}
          />
          {draft.status !== 'interested' ? (
            <EditableRow
              label="Applied through"
              value={draft.applicationSource}
              editing={editingField === 'applicationSource'}
              onStartEditing={() => setEditingField('applicationSource')}
              onChangeText={value => updateDraft('applicationSource', value)}
              onFinishEditing={finishEditingField}
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
              onStartEditing={() => {
                setAppliedAtText(formatDate(draft.appliedAt as string));
                setEditingField('appliedAt');
              }}
              onChangeText={setAppliedAtText}
              onFinishEditing={finishEditingAppliedAt}
            />
          ) : null}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            value={draft.notes ?? ''}
            onChangeText={value => updateDraft('notes', value)}
            placeholder="Add notes about the company, role, research, or anything else..."
            placeholderTextColor={theme.textMuted}
            multiline
            textAlignVertical="top"
            style={styles.notesInput}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          {events.map(event => (
            <View key={event.id} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityStatus}>
                  {formatStatus(event.status)}
                </Text>
                <Text style={styles.activityDate}>
                  {formatDate(event.createdAt)}
                </Text>
                {event.note ? (
                  <Text style={styles.activityNote}> {event.note} </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
        <View style={styles.deleteSection}>
          <Pressable onPress={handleDelete} style={styles.deleteLink}>
            <Text style={styles.deleteLinkText}>Delete application</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      height: 52,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    headerButton: { minWidth: 48, paddingVertical: 8 },
    headerButtonText: { fontSize: 15, color: theme.textSecondary },
    saveButtonText: {
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'right',
      color: theme.accent,
    },
    headerTitle: { fontSize: 15, fontWeight: '600', color: theme.text },
    content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
    missingContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
    missingTitle: {
      marginTop: 40,
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
    },
    hero: { paddingBottom: 28 },
    eyebrow: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: theme.textMuted,
    },
    title: { marginTop: 6, fontSize: 28, fontWeight: '700', color: theme.text },
    company: { marginTop: 4, fontSize: 16, color: theme.textSecondary },
    section: { marginBottom: 28 },
    sectionTitle: {
      marginBottom: 12,
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
    },
    statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    statusButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 7,
      backgroundColor: theme.surface,
    },
    statusButtonSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accent,
    },
    statusButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    statusButtonTextSelected: { color: theme.accentText },
    detailRow: {
      minHeight: 48,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    detailLabel: { width: 110, fontSize: 13, color: theme.textMuted },
    detailValue: {
      flex: 1,
      fontSize: 14,
      textAlign: 'right',
      color: theme.text,
    },
    employmentOptions: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 6,
    },
    notesInput: {
      minHeight: 130,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
      fontSize: 14,
      lineHeight: 20,
      color: theme.text,
    },
    activityRow: { flexDirection: 'row', paddingBottom: 18 },
    activityDot: {
      width: 8,
      height: 8,
      marginTop: 5,
      marginRight: 12,
      borderRadius: 4,
      backgroundColor: theme.accent,
    },
    activityContent: { flex: 1 },
    activityStatus: { fontSize: 14, fontWeight: '600', color: theme.text },
    activityDate: { marginTop: 2, fontSize: 12, color: theme.textMuted },
    activityNote: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 18,
      color: theme.textSecondary,
    },
    deleteSection: { marginTop: 8 },
    deleteLink: { paddingVertical: 12 },
    deleteLinkText: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      color: '#A33A32',
    },
    deleteConfirmation: {
      padding: 16,
      borderWidth: 1,
      borderColor: '#D9B8B4',
      borderRadius: 8,
      backgroundColor: '#FAF1F0',
    },
    deleteTitle: { fontSize: 15, fontWeight: '600', color: '#7D2E28' },
    deleteText: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 18,
      color: '#7D5A56',
    },
    deleteActions: {
      marginTop: 14,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    cancelDeleteButton: { paddingHorizontal: 12, paddingVertical: 8 },
    cancelDeleteButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    deleteButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: '#A33A32',
    },
    deleteButtonText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  });
}
