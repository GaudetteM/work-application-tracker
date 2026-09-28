import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { ApplicationStatus, EmploymentType } from '../../shared/types';
import type { MobileStackParamList } from '../navigation/MobileNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<MobileStackParamList, 'AddApplication'>;

export function AddApplicationScreen({ navigation }: Props): React.JSX.Element {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const addApplication = useApplicationStore(state => state.addApplication);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>('full_time');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [listingSource, setListingSource] = useState('');
  const [applicationSource, setApplicationSource] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('applied');
  const [notes, setNotes] = useState('');

  const styles = createStyles(theme);

  function handleSave(): void {
    if (!title.trim() || !company.trim()) {
      return;
    }

    const now = new Date().toISOString();

    addApplication({
      id: Date.now().toString(),
      title: title.trim(),
      company: company.trim(),
      employmentType,
      location: location.trim() || undefined,
      salary: salary.trim() || undefined,
      listingSource: listingSource.trim(),
      applicationSource: applicationSource.trim(),
      status,
      appliedAt: status === 'applied' ? now : undefined,
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });

    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Add Application</Text>

        <Pressable
          onPress={handleSave}
          style={styles.headerButton}
          disabled={!title.trim() || !company.trim()}
        >
          <Text
            style={[
              styles.saveText,
              !title.trim() || !company.trim()
                ? styles.saveTextDisabled
                : undefined,
            ]}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Job title"
          value={title}
          onChangeText={setTitle}
          placeholder="Senior Software Engineer"
          styles={styles}
        />

        <Field
          label="Company"
          value={company}
          onChangeText={setCompany}
          placeholder="Company name"
          styles={styles}
        />

        <Field
          label="Location"
          value={location}
          onChangeText={setLocation}
          placeholder="Remote, Minneapolis, MN"
          styles={styles}
        />

        <Field
          label="Salary"
          value={salary}
          onChangeText={setSalary}
          placeholder="$120k–$140k"
          styles={styles}
        />

        <OptionGroup
          label="Employment type"
          options={[
            {
              value: 'full_time',
              label: 'Full-time',
            },
            {
              value: 'contract',
              label: 'Contract',
            },
            {
              value: 'part_time',
              label: 'Part-time',
            },
          ]}
          value={employmentType}
          onChange={value => setEmploymentType(value as EmploymentType)}
          styles={styles}
        />

        <OptionGroup
          label="Status"
          options={[
            {
              value: 'interested',
              label: 'Interested',
            },
            {
              value: 'applied',
              label: 'Applied',
            },
          ]}
          value={status}
          onChange={value => setStatus(value as ApplicationStatus)}
          styles={styles}
        />

        <Field
          label="Found via"
          value={listingSource}
          onChangeText={setListingSource}
          placeholder="LinkedIn"
          styles={styles}
        />

        <Field
          label="Applied through"
          value={applicationSource}
          onChangeText={setApplicationSource}
          placeholder="Company website"
          styles={styles}
        />

        <Field
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything worth remembering..."
          multiline
          styles={styles}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  styles,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline ? styles.multilineInput : undefined]}
      />
    </View>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
  styles,
}: {
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  value: string;
  onChange: (value: string) => void;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.optionRow}>
        {options.map(option => {
          const selected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[
                styles.option,
                selected ? styles.optionSelected : undefined,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selected ? styles.optionTextSelected : undefined,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    headerButton: {
      minWidth: 60,
      paddingVertical: 8,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.text,
    },
    cancelText: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    saveText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.accent,
      textAlign: 'right',
    },
    saveTextDisabled: {
      color: theme.textFaint,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    field: {
      marginBottom: 22,
    },
    label: {
      marginBottom: 8,
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    input: {
      minHeight: 46,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      fontSize: 16,
    },
    placeholder: {
      color: theme.textMuted,
    },
    multilineInput: {
      minHeight: 120,
      paddingTop: 12,
    },
    optionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    option: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.surface,
    },
    optionSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accent,
    },
    optionText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    optionTextSelected: {
      color: theme.accentText,
    },
  });
}
