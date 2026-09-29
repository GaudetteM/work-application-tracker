import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';

type EmploymentTypeButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function EmploymentTypeButton({
  label,
  selected,
  onPress,
}: EmploymentTypeButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.borderStrong,
        },
        selected && {
          backgroundColor: theme.border,
          borderColor: theme.borderStrong,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.textSecondary,
          },
          selected && styles.selectedText,
          selected && {
            color: theme.text,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 8,
  },

  text: {
    fontSize: 13,
    fontWeight: '500',
  },

  selectedText: {
    fontWeight: '600',
  },
});
