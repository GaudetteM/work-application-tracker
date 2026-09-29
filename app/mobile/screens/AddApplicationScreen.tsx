import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { ApplicationStatus, EmploymentType } from '../../shared/types';
import { Field, OptionGroup } from '../components';
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
          placeholder=""
        />

        <Field
          label="Company"
          value={company}
          onChangeText={setCompany}
          placeholder=""
        />

        <Field
          label="Location"
          value={location}
          onChangeText={setLocation}
          placeholder=""
        />

        <Field
          label="Salary"
          value={salary}
          onChangeText={setSalary}
          placeholder=""
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
        />

        <Field
          label="Found via"
          value={listingSource}
          onChangeText={setListingSource}
          placeholder="LinkedIn"
        />

        {status !== 'interested' ? (
          <Field
            label="Applied through"
            value={applicationSource}
            onChangeText={setApplicationSource}
            placeholder="Company website"
          />
        ) : null}

        <Field
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything worth remembering..."
          multiline
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  });
}
