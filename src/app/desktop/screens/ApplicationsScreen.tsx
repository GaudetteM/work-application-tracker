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
import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { Theme } from '../../shared/theme/theme';

export function ApplicationsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
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
          placeholderTextColor={theme.textMuted}
          editable={!showAdd && !selectedApplication}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listContainer}>
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
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.text,
    },

    title: {
      marginTop: 4,
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
    },

    addButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },

    addButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.text,
    },

    searchContainer: {
      paddingHorizontal: 8,
      paddingBottom: 18,
    },

    searchInput: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderRadius: 8,
      fontSize: 18,
      color: theme.text,
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
    },

    listContainer: {
      flex: 1,
      marginHorizontal: 14,
      marginBottom: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      backgroundColor: theme.background,
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
      color: theme.text,
    },

    emptyText: {
      marginTop: 6,
      fontSize: 13,
      color: theme.textMuted,
      textAlign: 'center',
    },
  });
}

