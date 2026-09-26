import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ApplicationRow } from '../components/ApplicationRow';
import { AddApplicationModal } from './modals/AddApplicationModal';
import { ApplicationDetailsModal } from './modals/ApplicationDetailsModal';
import { useApplicationStore } from '../store/ApplicationStore';

export function ApplicationsScreen() {
  const applications = useApplicationStore(state => state.applications);

  const events = useApplicationStore(state => state.events);

  const addApplication = useApplicationStore(state => state.addApplication);

  const updateApplication = useApplicationStore(
    state => state.updateApplication,
  );

  const changeStatus = useApplicationStore(state => state.changeStatus);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null,
  );

  const search = searchQuery.trim().toLowerCase();

  const filteredApplications = applications.filter(application => {
    if (!search) {
      return true;
    }

    return (
      application.title.toLowerCase().includes(search) ||
      application.company.toLowerCase().includes(search) ||
      application.location?.toLowerCase().includes(search)
    );
  });

  const selected =
    applications.find(application => application.id === selectedApplication) ??
    null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>WORK SEARCH</Text>

          <Text style={styles.title}>Applications</Text>
        </View>

        <Pressable onPress={() => setShowAdd(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Application</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search applications..."
          placeholderTextColor="#999994"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={filteredApplications}
          keyExtractor={application => application.id}
          renderItem={({ item }) => (
            <ApplicationRow
              application={item}
              onPress={() => setSelectedApplication(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No applications found</Text>

              <Text style={styles.emptyText}>
                {applications.length === 0
                  ? 'Add your first application to get started.'
                  : 'Try a different search.'}
              </Text>
            </View>
          }
        />
      </View>

      {showAdd && (
        <AddApplicationModal
          onClose={() => setShowAdd(false)}
          onSave={application => {
            addApplication(application);
            setShowAdd(false);
          }}
        />
      )}

      {selected && (
        <ApplicationDetailsModal
          application={selected}
          events={events.filter(event => event.applicationId === selected.id)}
          onClose={() => setSelectedApplication(null)}
          onSave={updateApplication}
          onStatusChange={status => {
            changeStatus(selected.id, status);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 20,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#999994',
  },

  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '700',
    color: '#181816',
  },

  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#181816',
  },

  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  searchContainer: {
    paddingHorizontal: 28,
    paddingBottom: 18,
  },

  searchInput: {
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#181816',
    fontSize: 14,
  },

  listContainer: {
    flex: 1,
    marginHorizontal: 28,
    marginBottom: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E3E3E0',
    borderRadius: 10,
    backgroundColor: '#F7F7F5',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#20201D',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: '#8A8A84',
    textAlign: 'center',
  },
});
