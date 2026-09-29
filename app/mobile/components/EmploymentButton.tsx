import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { EmploymentType } from '../../shared/types';

type EmploymentButtonProps = {
  type: EmploymentType;
  selected: boolean;
  onPress: () => void;
};

export function EmploymentButton({
  type,
  selected,
  onPress,
}: EmploymentButtonProps): React.JSX.Element {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        { borderColor: theme.border, backgroundColor: theme.surface },
        selected && { borderColor: theme.accent, backgroundColor: theme.accent },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: theme.textSecondary },
          selected && { color: theme.accentText },
        ]}
      >
        {formatEmploymentType(type)}
      </Text>
    </Pressable>
  );
}

function formatEmploymentType(type: EmploymentType): string {
  switch (type) {
    case 'full_time':
      return 'Full-time';
    case 'contract':
      return 'Contract';
    case 'part_time':
      return 'Part-time';
  }
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 6,
  },
  text: { fontSize: 11 },
});
