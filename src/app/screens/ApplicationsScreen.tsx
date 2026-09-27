import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ApplicationRow } from '../components';
import { AddApplicationModal } from './modals/AddApplicationModal';
import { ApplicationDetailsModal } from './modals/ApplicationDetailsModal';
import { useApplicationStore } from '../store/ApplicationStore';
import { useTheme } from '../theme/ThemeProvider';

export function ApplicationsScreen() {
  const { theme } = useTheme();
  const applications = useApplicationStore(state => state.applications);

  const events = useApplicationStore(state => state.events);

  const addApplication = useApplicationStore(state => state.addApplication);

  const saveApplication = useApplicationStore(state => state.saveApplication);

  const deleteApplication = useApplicationStore(
    state => state.deleteApplication,
  );

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
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: theme.text }]}>
            WORK SEARCH
          </Text>

          <Text style={[styles.title, { color: theme.text }]}>
            Applications
          </Text>
        </View>

        <Pressable
          onPress={() => setShowAdd(true)}
          style={[
            styles.addButton,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.addButtonText, { color: theme.text }]}>
            + Add Application
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search applications..."
            placeholderTextColor={theme.textMuted}
            editable={!showAdd && !selectedApplication}
            style={[
              styles.searchInput,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.inputBackground,
              },
            ]}
          />
        </View>
      </View>

      <View
        style={[
          styles.listContainer,
          { backgroundColor: theme.background, borderColor: theme.background },
        ]}
      >
        <FlatList
          data={filteredApplications}
          keyExtractor={application => application.id}
          renderItem={({ item, index }) => (
            <ApplicationRow
              index={index}
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
          onSave={application => {
            saveApplication(application, selected.status);
            setSelectedApplication(null);
          }}
          onDelete={() => {
            deleteApplication(selected.id);
            setSelectedApplication(null);
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
    borderWidth: 1,
    backgroundColor: '#181816',
  },

  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  searchContainer: {
    paddingHorizontal: 8,
    paddingBottom: 18,
  },

  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 18,
  },

  listContainer: {
    flex: 1,
    marginHorizontal: 14,
    marginBottom: 14,
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
