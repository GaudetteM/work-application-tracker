import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { JobApplication, EmploymentType } from '../../../shared/types';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import type { Theme } from '../../../shared/theme/theme';
import { EmploymentTypeButton } from '../../components';

const LISTING_SOURCES = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Recruiter',
  'Other',
] as const;

const APPLICATION_SOURCES = [
  'Company Website',
  'LinkedIn',
  'Indeed',
  'Recruiter',
  'Email',
  'Referral',
  'Other',
] as const;

type AddApplicationModalProps = {
  onClose: () => void;
  onSave: (application: JobApplication) => void;
};

export function AddApplicationModal({
  onClose,
  onSave,
}: AddApplicationModalProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>('full_time');

  const [listingSource, setListingSource] = useState('Other');
  const [applicationSource, setApplicationSource] = useState('Other');

  const [listingSourceOpen, setListingSourceOpen] = useState(false);
  const [applicationSourceOpen, setApplicationSourceOpen] = useState(false);

  const canSave = title.trim() !== '' && company.trim() !== '';

  const save = (): void => {
    if (!canSave) {
      return;
    }

    const now = new Date().toISOString();

    onSave({
      id: Date.now().toString(),
      title: title.trim(),
      company: company.trim(),
      employmentType,
      location: location.trim() || undefined,
      salary: salary.trim() || undefined,
      listingSource,
      applicationSource,
      status: 'applied',
      appliedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalTitle}>Add Application</Text>
            <Text style={styles.modalSubtitle}>
              Log an application in a few seconds.
            </Text>
          </View>

          <Pressable onPress={onClose}>
            <Text style={styles.close}>×</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Job title</Text>

        <TextInput
          autoFocus
          value={title}
          onChangeText={setTitle}
          placeholder="Senior Software Engineer"
          placeholderTextColor={theme.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Company</Text>

        <TextInput
          value={company}
          onChangeText={setCompany}
          placeholder="Company name"
          placeholderTextColor={theme.textMuted}
          style={styles.input}
        />

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Location</Text>

            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Remote, Minneapolis, MN"
              placeholderTextColor={theme.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputHalf}>
            <Text style={styles.label}>Salary</Text>

            <TextInput
              value={salary}
              onChangeText={setSalary}
              placeholder="$120k–$150k"
              placeholderTextColor={theme.textMuted}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.sourceSection}>
          <Text style={styles.label}>Found via</Text>

          <Pressable
            onPress={() => {
              setListingSourceOpen(current => !current);
              setApplicationSourceOpen(false);
            }}
            style={styles.sourceButton}
          >
            <Text style={styles.sourceButtonText}>{listingSource}</Text>

            <Text style={styles.sourceChevron}>
              {listingSourceOpen ? '⌃' : '⌄'}
            </Text>
          </Pressable>

          {listingSourceOpen && (
            <View style={styles.sourceOptions}>
              {LISTING_SOURCES.map(source => (
                <Pressable
                  key={source}
                  onPress={() => {
                    setListingSource(source);
                    setListingSourceOpen(false);
                  }}
                  style={[
                    styles.sourceOption,
                    source === listingSource && styles.sourceOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.sourceOptionText,
                      source === listingSource &&
                        styles.sourceOptionTextSelected,
                    ]}
                  >
                    {source}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sourceSection}>
          <Text style={styles.label}>Applied through</Text>

          <Pressable
            onPress={() => {
              setApplicationSourceOpen(current => !current);
              setListingSourceOpen(false);
            }}
            style={styles.sourceButton}
          >
            <Text style={styles.sourceButtonText}>{applicationSource}</Text>

            <Text style={styles.sourceChevron}>
              {applicationSourceOpen ? '⌃' : '⌄'}
            </Text>
          </Pressable>

          {applicationSourceOpen && (
            <View style={styles.sourceOptions}>
              {APPLICATION_SOURCES.map(source => (
                <Pressable
                  key={source}
                  onPress={() => {
                    setApplicationSource(source);
                    setApplicationSourceOpen(false);
                  }}
                  style={[
                    styles.sourceOption,
                    source === applicationSource && styles.sourceOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.sourceOptionText,
                      source === applicationSource &&
                        styles.sourceOptionTextSelected,
                    ]}
                  >
                    {source}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.label}>Employment type</Text>

        <View style={styles.typeOptions}>
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

        <View style={styles.modalActions}>
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={save}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveText}>Add Application</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    modalOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.28)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    modal: {
      width: 680,
      maxWidth: '90%',
      backgroundColor: theme.surface,
      borderRadius: 14,
      padding: 28,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },

    modalHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 28,
    },

    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.text,
    },

    modalSubtitle: {
      marginTop: 5,
      fontSize: 14,
      color: theme.textSecondary,
    },

    close: {
      fontSize: 26,
      lineHeight: 26,
      color: theme.textSecondary,
    },

    label: {
      marginBottom: 7,
      fontSize: 13,
      fontWeight: '600',
      color: theme.text,
    },

    input: {
      height: 42,
      paddingHorizontal: 12,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      fontSize: 14,
    },

    inputRow: {
      flexDirection: 'row',
      gap: 14,
    },

    inputHalf: {
      flex: 1,
    },

    typeOptions: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 28,
    },

    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      paddingTop: 4,
    },

    cancelButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
    },

    cancelText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },

    saveButton: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: theme.accent,
    },

    saveButtonDisabled: {
      opacity: 0.5,
    },

    saveText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.accentText,
    },

    sourceSection: {
      marginBottom: 18,
    },

    sourceButton: {
      height: 42,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
    },

    sourceButtonText: {
      fontSize: 14,
      color: theme.text,
    },

    sourceChevron: {
      fontSize: 16,
      color: theme.textSecondary,
    },

    sourceOptions: {
      marginTop: 4,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.surface,
    },

    sourceOption: {
      paddingHorizontal: 10,
      paddingVertical: 9,
      borderRadius: 5,
    },

    sourceOptionSelected: {
      backgroundColor: theme.surfaceSecondary,
    },

    sourceOptionText: {
      fontSize: 13,
      color: theme.textSecondary,
    },

    sourceOptionTextSelected: {
      fontWeight: '600',
      color: theme.text,
    },
  });
}

