import React, { useMemo, useState } from 'react';

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useApplicationStore } from '../../shared/store/ApplicationStore';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { Theme } from '../../shared/theme/theme';

import { ApplicationRow } from '../components';
import type { MobileStackParamList } from '../navigation/MobileNavigator';

type NavigationProp = NativeStackNavigationProp<
  MobileStackParamList,
  'MainTabs'
>;

interface Props {
  navigation: NavigationProp;
}

export function ApplicationsScreen({ navigation }: Props): React.JSX.Element {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const applications = useApplicationStore(state => state.applications);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplications = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    if (!search) {
      return applications;
    }

    return applications.filter(
      application =>
        application.title.toLowerCase().includes(search) ||
        application.company.toLowerCase().includes(search) ||
        application.location?.toLowerCase().includes(search),
    );
  }, [applications, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>WORK SEARCH</Text>
        <Text style={styles.title}>Applications</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search applications"
          placeholderTextColor={theme.textMuted}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={application => application.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ApplicationRow
            application={item}
            onPress={() => {
              navigation.navigate('ApplicationDetails', {
                applicationId: item.id,
              });
            }}
            index={index}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {applications.length === 0
                ? 'No applications yet'
                : 'No matches found'}
            </Text>

            <Text style={styles.emptyText}>
              {applications.length === 0
                ? 'Add your first application to start tracking your search.'
                : 'Try a different search.'}
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={() => {
          navigation.navigate('AddApplication');
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
    },

    eyebrow: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: theme.textMuted,
    },

    title: {
      marginTop: 4,
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
    },

    searchContainer: {
      paddingHorizontal: 20,
      paddingBottom: 12,
    },

    searchInput: {
      height: 42,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      fontSize: 14,
    },

    listContent: {
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 100,
    },

    emptyState: {
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingTop: 80,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },

    emptyText: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      color: theme.textMuted,
    },

    addButton: {
      position: 'absolute',
      right: 20,
      bottom: 24,
      width: 54,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 27,
      backgroundColor: theme.accent,
    },

    addButtonText: {
      marginTop: -2,
      fontSize: 30,
      fontWeight: '300',
      lineHeight: 32,
      color: theme.accentText,
    },
  });
}
