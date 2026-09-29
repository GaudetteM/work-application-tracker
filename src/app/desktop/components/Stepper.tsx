import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  suffix,
}: StepperProps) {
  const { theme } = useTheme();

  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <View
      style={[
        styles.container,
        { borderColor: theme.border, backgroundColor: theme.surface },
      ]}
    >
      <Pressable
        onPress={decrement}
        disabled={value <= min}
        style={[styles.button, value <= min && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>−</Text>
      </Pressable>

      <Text style={[styles.value, { color: theme.text }]}>
        {value}
        {suffix ? ` ${suffix}` : ''}
      </Text>

      <Pressable
        onPress={increment}
        disabled={value >= max}
        style={[styles.button, value >= max && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    minWidth: 130,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});
