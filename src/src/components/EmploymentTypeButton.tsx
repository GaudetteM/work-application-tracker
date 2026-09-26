import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

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
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, selected && styles.buttonSelected]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
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
    borderColor: '#D9D9D5',
    borderRadius: 8,
    backgroundColor: '#FAFAF8',
  },

  buttonSelected: {
    backgroundColor: '#E8E8E4',
    borderColor: '#BDBDB7',
  },

  text: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555550',
  },

  textSelected: {
    color: '#181816',
    fontWeight: '600',
  },
});
