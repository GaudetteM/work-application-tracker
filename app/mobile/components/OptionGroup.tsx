import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';

type OptionGroupProps = {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
};

export function OptionGroup({
  label,
  options,
  value,
  onChange,
}: OptionGroupProps): React.JSX.Element {
  const { theme } = useTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <View style={styles.optionRow}>
        {options.map(option => {
          const selected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[
                styles.option,
                { borderColor: theme.border, backgroundColor: theme.surface },
                selected && {
                  borderColor: theme.accent,
                  backgroundColor: theme.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: theme.textSecondary },
                  selected && { color: theme.accentText },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 22,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
