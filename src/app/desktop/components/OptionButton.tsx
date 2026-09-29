import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeProvider';

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

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        { borderColor: theme.border, backgroundColor: theme.surface },
        selected && {
          borderColor: theme.borderStrong,
          backgroundColor: theme.surfaceSecondary,
        },
      ]}
    >
      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionLabel,
            { color: theme.textSecondary },
            selected && { fontWeight: '600', color: theme.text },
          ]}
        >
          {label}
        </Text>

        {description && (
          <Text style={[styles.optionDescription, { color: theme.textMuted }]}>
            {description}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.radio,
          { borderColor: theme.borderStrong },
          selected && { borderColor: theme.text },
        ]}
      >
        {selected && (
          <View style={[styles.radioDot, { backgroundColor: theme.text }]} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionDescription: {
    marginTop: 2,
    fontSize: 12,
  },
  radio: {
    width: 18,
    height: 18,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 9,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

