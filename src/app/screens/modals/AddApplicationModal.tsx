import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { JobApplication, EmploymentType } from '../../types';
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

  const save = (): void => {
    const now = new Date().toISOString();
    onSave({
      id: Date.now().toString(),
      title: title.trim() === '' ? 'Senior Software Engineer' : title.trim(),
      company: company.trim() === '' ? 'Company name' : company.trim(),
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
          placeholderTextColor="#999"
          style={styles.input}
        />

        <Text style={styles.label}>Company</Text>

        <TextInput
          value={company}
          onChangeText={setCompany}
          placeholder="Company name"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Location</Text>

            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Remote"
              placeholderTextColor="#999"
              style={styles.input}
            />
          </View>

          <View style={styles.inputHalf}>
            <Text style={styles.label}>Salary</Text>

            <TextInput
              value={salary}
              onChangeText={setSalary}
              placeholder="$120k–$150k"
              placeholderTextColor="#999"
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

          <Pressable onPress={save} style={styles.saveButton}>
            <Text style={styles.saveText}>Add Application</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E3E3E0',
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
    color: '#181816',
  },

  modalSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#777772',
  },

  close: {
    fontSize: 26,
    lineHeight: 26,
    color: '#777772',
  },

  label: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: '600',
    color: '#454540',
  },

  input: {
    height: 42,
    paddingHorizontal: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FAFAF8',
    color: '#181816',
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

  typeButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FAFAF8',
  },

  typeButtonSelected: {
    backgroundColor: '#E8E8E4',
    borderColor: '#BDBDB7',
  },

  typeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555550',
  },

  typeButtonTextSelected: {
    color: '#181816',
    fontWeight: '600',
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
    color: '#666660',
  },

  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#181816',
  },

  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FAFAF8',
  },

  sourceButtonText: {
    fontSize: 14,
    color: '#181816',
  },

  sourceChevron: {
    fontSize: 16,
    color: '#777772',
  },

  sourceOptions: {
    marginTop: 4,
    padding: 4,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },

  sourceOption: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 5,
  },

  sourceOptionSelected: {
    backgroundColor: '#E8E8E4',
  },

  sourceOptionText: {
    fontSize: 13,
    color: '#555550',
  },

  sourceOptionTextSelected: {
    fontWeight: '600',
    color: '#181816',
  },
});
