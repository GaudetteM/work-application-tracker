import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';

type EditableRowProps = {
  label: string;
  value: string;
  editing: boolean;
  onStartEditing: () => void;
  onChangeText: (value: string) => void;
  onFinishEditing: () => void;
  placeholder?: string;
};

export function EditableRow({
  label,
  value,
  editing,
  onStartEditing,
  onChangeText,
  onFinishEditing,
  placeholder,
}: EditableRowProps): React.JSX.Element {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.detailRow, { borderBottomColor: theme.border }]}
    >
      <Text style={[styles.detailLabel, { color: theme.textMuted }]}>
        {label}
      </Text>
      {editing ? (
        <TextInput
          autoFocus
          value={value}
          onChangeText={onChangeText}
          onBlur={onFinishEditing}
          onSubmitEditing={onFinishEditing}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          style={[
            styles.editableInput,
            {
              borderColor: theme.accent,
              backgroundColor: theme.inputBackground,
              color: theme.text,
            },
          ]}
        />
      ) : (
        <Pressable onPress={onStartEditing} style={styles.editableValueContainer}>
          <Text
            style={[
              styles.detailValue,
              { color: theme.text },
              !value && { color: theme.textMuted },
            ]}
          >
            {value || placeholder || 'Not specified'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    minHeight: 48,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  detailLabel: { width: 110, fontSize: 13 },
  detailValue: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  editableValueContainer: { flex: 1 },
  editableInput: {
    flex: 1,
    minHeight: 36,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 14,
    textAlign: 'right',
  },
});
