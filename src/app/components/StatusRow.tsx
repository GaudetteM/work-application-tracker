import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function StatusRow({ label, count }: { label: string; count: number }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.statusRow,
        {
          borderBottomColor: theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.statusLabel,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.statusCount,
          {
            color: theme.text,
          },
        ]}
      >
        {count}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
    borderBottomWidth: 1,
  },

  statusLabel: {
    fontSize: 12,
  },

  statusCount: {
    fontSize: 12,
    fontWeight: '600',
  },
});
