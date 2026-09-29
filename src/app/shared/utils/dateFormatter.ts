import type { DateFormat, WeekStart } from '../settings/SettingsProvider';

export function formatDate(value: string | Date, format: DateFormat): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  switch (format) {
    case 'month_day_year':
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);

    case 'day_month_year':
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);

    case 'numeric_us':
      return new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).format(date);

    case 'numeric_international':
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
  }
}

/**
 * Parses text typed into a date-editing field back into a Date, interpreting
 * ambiguous numeric input (e.g. "09/28/2026") according to the active
 * dateFormat rather than relying on the JS engine's locale-dependent
 * Date.parse, which varies between Hermes/JSC/V8 for non-ISO strings.
 */
export function parseDateInput(text: string, format: DateFormat): Date | null {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  const numericMatch = trimmed.match(/^(\d{1,4})[/-](\d{1,2})[/-](\d{1,4})$/);

  if (numericMatch) {
    const [, a, b, c] = numericMatch;
    let year: number;
    let month: number;
    let day: number;

    if (a.length === 4) {
      year = Number(a);
      month = Number(b);
      day = Number(c);
    } else if (format === 'numeric_international' || format === 'day_month_year') {
      day = Number(a);
      month = Number(b);
      year = Number(c);
    } else {
      month = Number(a);
      day = Number(b);
      year = Number(c);
    }

    const date = new Date(year, month - 1, day);

    const isValid =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    return isValid ? date : null;
  }

  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function formatRelativeDate(
  value: string | Date,
  dateFormat: DateFormat,
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return 'Yesterday';
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(date, dateFormat);
}

export function getStartOfWeek(value: Date, weekStart: WeekStart): Date {
  const result = new Date(value);
  const day = result.getDay();

  const startDay = weekStart === 'sunday' ? 0 : 1;
  const difference = (day - startDay + 7) % 7;

  result.setDate(result.getDate() - difference);
  result.setHours(0, 0, 0, 0);

  return result;
}
