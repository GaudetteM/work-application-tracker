import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type OptionButtonProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionButton({
  label,
  description,
  selected,
  onPress,
}: OptionButtonProps) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    option: {
      minHeight: 52,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.surface,
    },
    optionSelected: {
      borderColor: theme.borderStrong,
      backgroundColor: theme.surfaceSecondary,
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    optionLabelSelected: {
      fontWeight: '600',
      color: theme.text,
    },
    optionDescription: {
      marginTop: 2,
      fontSize: 12,
      color: theme.textMuted,
    },
    radio: {
      width: 18,
      height: 18,
      marginLeft: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.borderStrong,
      borderRadius: 9,
    },
    radioSelected: {
      borderColor: theme.text,
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.text,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <View style={styles.optionContent}>
        <Text
          style={[styles.optionLabel, selected && styles.optionLabelSelected]}
        >
          {label}
        </Text>

        {description && (
          <Text style={styles.optionDescription}>{description}</Text>
        )}
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
  );
}
