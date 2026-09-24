import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
type EmploymentType = 'full_time' | 'contract' | 'part_time';
type Application = {
  id: string;
  title: string;
  company: string;
  employmentType: EmploymentType;
  location?: string;
  salary?: string;
  listingSource: string;
  applicationSource: string;
  status: string;
  appliedAt: string;
  notes?: string;
};
const initialApplications: Application[] = [
  {
    id: '1',
    title: 'Senior React Native Engineer',
    company: 'Example Company',
    employmentType: 'full_time',
    location: 'Remote',
    salary: '$120k–$145k',
    listingSource: 'LinkedIn',
    applicationSource: 'Company Website',
    status: 'Applied',
    appliedAt: 'Sep 24, 2026',
    notes:
      'Healthcare company focused on improving access to care. Their mobile team appears to be growing.',
  },
];
export function ApplicationsScreen() {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>WORK SEARCH</Text>
          <Text style={styles.title}>Applications</Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => setShowAdd(true)}>
          <Text style={styles.addButtonText}>+ Add Application</Text>
        </Pressable>
      </View>
      <TextInput
        placeholder="Search applications..."
        placeholderTextColor="#999"
        style={styles.search}
      />
      <View style={styles.list}>
        {applications.map(application => (
          <ApplicationRow
            key={application.id}
            application={application}
            onPress={() => setSelectedApplication(application)}
          />
        ))}
      </View>
      {showAdd && (
        <AddApplicationModal
          onClose={() => setShowAdd(false)}
          onSave={application => {
            setApplications(current => [application, ...current]);
            setShowAdd(false);
          }}
        />
      )}
      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </View>
  );
}
function ApplicationRow({
  application,
  onPress,
}: {
  application: Application;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.rowMain}>
        <View style={styles.titleRow}>
          <Text style={styles.jobTitle}>{application.title}</Text>
          <EmploymentBadge type={application.employmentType} />
        </View>
        <Text style={styles.company}>
          {application.company}
          {application.location ? ` · ${application.location}` : ''}
        </Text>
        <Text style={styles.meta}>
          {application.listingSource} {' → '} {application.applicationSource}
          {application.appliedAt}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {application.salary && (
          <Text style={styles.salary}>{application.salary}</Text>
        )}
        <View style={styles.status}>
          <Text style={styles.statusText}> {application.status} </Text>
        </View>
      </View>
    </Pressable>
  );
}
function EmploymentBadge({ type }: { type: EmploymentType }) {
  const labels: Record<EmploymentType, string> = {
    full_time: 'Full-time',
    contract: 'Contract',
    part_time: 'Part-time',
  };
  return (
    <View style={styles.employmentBadge}>
      <Text style={styles.employmentBadgeText}> {labels[type]} </Text>
    </View>
  );
}
function AddApplicationModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (application: Application) => void;
}) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>('full_time');
  const save = () => {
    if (!title.trim() || !company.trim()) {
      return;
    }
    onSave({
      id: Date.now().toString(),
      title: title.trim(),
      company: company.trim(),
      employmentType,
      location: location.trim() || undefined,
      salary: salary.trim() || undefined,
      listingSource: 'Other',
      applicationSource: 'Other',
      status: 'Applied',
      appliedAt: 'Sep 24, 2026',
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
function EmploymentTypeButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.typeButton, selected && styles.typeButtonSelected]}
    >
      <Text
        style={[
          styles.typeButtonText,
          selected && styles.typeButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
function ApplicationDetails({
  application,
  onClose,
}: {
  application: Application;
  onClose: () => void;
}) {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.detailsModal}>
        <View style={styles.detailsHeader}>
          <View style={styles.detailsHeaderText}>
            <Text style={styles.detailsTitle}> {application.title} </Text>
            <Text style={styles.detailsCompany}> {application.company} </Text>
          </View>
          <Pressable onPress={onClose}>
            <Text style={styles.close}>×</Text>
          </Pressable>
        </View>
        <View style={styles.detailsBadges}>
          <EmploymentBadge type={application.employmentType} />
          <View style={styles.status}>
            <Text style={styles.statusText}> {application.status} </Text>
          </View>
        </View>
        <View style={styles.detailsGrid}>
          <DetailField label="Location" value={application.location} />
          <DetailField label="Salary" value={application.salary} />
          <DetailField label="Found via" value={application.listingSource} />
          <DetailField
            label="Applied through"
            value={application.applicationSource}
          />
          <DetailField label="Applied" value={application.appliedAt} />
        </View>
        <View style={styles.notesSection}>
          <Text style={styles.sectionLabel}>Notes</Text>
          <Text style={styles.notes}>
            {application.notes || 'No notes yet.'}
          </Text>
        </View>
        <View style={styles.detailsActions}>
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
function DetailField({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }
  return (
    <View style={styles.detailField}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: '#888' },
  title: { marginTop: 8, fontSize: 30, fontWeight: '700', color: '#171717' },
  addButton: {
    backgroundColor: '#171717',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  search: {
    marginTop: 28,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D9D9D6',
    borderRadius: 7,
    backgroundColor: '#FFF',
    fontSize: 14,
    color: '#171717',
  },
  list: { marginTop: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D9D9D6',
  },
  rowPressed: { backgroundColor: '#F0F0ED' },
  rowMain: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  jobTitle: { fontSize: 15, fontWeight: '600', color: '#171717' },
  employmentBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#EAEAE7',
  },
  employmentBadgeText: { fontSize: 10, fontWeight: '600', color: '#666' },
  company: { marginTop: 4, fontSize: 14, color: '#555' },
  meta: { marginTop: 7, fontSize: 12, color: '#888' },
  rowRight: { alignItems: 'flex-end', marginLeft: 24 },
  salary: { fontSize: 13, fontWeight: '600', color: '#555' },
  status: {
    marginTop: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    backgroundColor: '#E7E7E4',
  },
  statusText: { fontSize: 11, fontWeight: '600', color: '#555' },
  modalOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: 560,
    padding: 28,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#171717' },
  modalSubtitle: { marginTop: 4, fontSize: 13, color: '#888' },
  close: { fontSize: 28, lineHeight: 28, color: '#777' },
  label: {
    marginBottom: 6,
    marginTop: 16,
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D9D9D6',
    borderRadius: 6,
    backgroundColor: '#FAFAF9',
    fontSize: 14,
    color: '#171717',
  },
  inputRow: { flexDirection: 'row', gap: 12 },
  inputHalf: { flex: 1 },
  typeOptions: { flexDirection: 'row', gap: 8 },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D9D9D6',
    borderRadius: 6,
    backgroundColor: '#FAFAF9',
  },
  typeButtonSelected: { borderColor: '#171717', backgroundColor: '#171717' },
  typeButtonText: { fontSize: 12, fontWeight: '600', color: '#666' },
  typeButtonTextSelected: { color: '#FFF' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 28,
  },
  cancelButton: { paddingHorizontal: 14, paddingVertical: 9 },
  cancelText: { fontSize: 14, color: '#555' },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 7,
    backgroundColor: '#171717',
  },
  saveText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  detailsModal: {
    width: 680,
    maxHeight: '85%',
    padding: 32,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  detailsHeaderText: { flex: 1 },
  detailsTitle: { fontSize: 24, fontWeight: '700', color: '#171717' },
  detailsCompany: { marginTop: 5, fontSize: 15, color: '#666' },
  detailsBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 48,
    rowGap: 20,
    marginTop: 28,
    paddingTop: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D9D9D6',
  },
  detailField: { minWidth: 140 },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#999',
  },
  detailValue: { marginTop: 5, fontSize: 14, color: '#333' },
  notesSection: {
    marginTop: 28,
    paddingTop: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D9D9D6',
  },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#333' },
  notes: { marginTop: 10, fontSize: 14, lineHeight: 21, color: '#555' },
  detailsActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 28,
  },
});
