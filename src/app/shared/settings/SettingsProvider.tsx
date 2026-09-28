import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type TimeFormat = '12h' | '24h';

export type DateFormat =
  | 'month_day_year'
  | 'day_month_year'
  | 'numeric_us'
  | 'numeric_international';

export type WeekStart = 'sunday' | 'monday';

type SettingsContextValue = {
  timeFormat: TimeFormat;
  dateFormat: DateFormat;
  weekStart: WeekStart;
  setTimeFormat: (format: TimeFormat) => void;
  setDateFormat: (format: DateFormat) => void;
  setWeekStart: (day: WeekStart) => void;
};

const TIME_FORMAT_KEY = 'work-tracker-time-format';
const DATE_FORMAT_KEY = 'work-tracker-date-format';
const WEEK_START_KEY = 'work-tracker-week-start';

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>('12h');

  const [dateFormat, setDateFormatState] = useState<DateFormat>('numeric_us');

  const [weekStart, setWeekStartState] = useState<WeekStart>('sunday');

  useEffect(() => {
    AsyncStorage.getItem(TIME_FORMAT_KEY).then(value => {
      if (value === '12h' || value === '24h') {
        setTimeFormatState(value);
      }
    });

    AsyncStorage.getItem(DATE_FORMAT_KEY).then(value => {
      if (value === 'numeric_us' || value === 'numeric_international') {
        setDateFormatState(value);
      }
    });

    AsyncStorage.getItem(WEEK_START_KEY).then(value => {
      if (value === 'sunday' || value === 'monday') {
        setWeekStartState(value);
      }
    });
  }, []);

  const setTimeFormat = (format: TimeFormat) => {
    setTimeFormatState(format);
    AsyncStorage.setItem(TIME_FORMAT_KEY, format);
  };

  const setDateFormat = (format: DateFormat) => {
    setDateFormatState(format);
    AsyncStorage.setItem(DATE_FORMAT_KEY, format);
  };

  const setWeekStart = (day: WeekStart) => {
    setWeekStartState(day);
    AsyncStorage.setItem(WEEK_START_KEY, day);
  };

  const value = useMemo(
    () => ({
      timeFormat,
      dateFormat,
      weekStart,
      setTimeFormat,
      setDateFormat,
      setWeekStart,
    }),
    [timeFormat, dateFormat, weekStart],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }

  return context;
}
