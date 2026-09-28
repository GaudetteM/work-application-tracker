import { useCallback } from 'react';

import { useSettings } from '../settings/SettingsProvider';
import {
  formatDate as formatDateValue,
  formatRelativeDate as formatRelativeDateValue,
} from './dateFormatter';

export function useDateFormatter() {
  const { dateFormat } = useSettings();

  const formatDate = useCallback(
    (value: string | Date) => {
      return formatDateValue(value, dateFormat);
    },
    [dateFormat],
  );

  const formatRelativeDate = useCallback(
    (value: string | Date) => {
      return formatRelativeDateValue(value, dateFormat);
    },
    [dateFormat],
  );

  return {
    formatDate,
    formatRelativeDate,
  };
}
