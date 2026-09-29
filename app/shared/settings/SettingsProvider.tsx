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
  weeklyGoal: number;
  setTimeFormat: (format: TimeFormat) => void;
  setDateFormat: (format: DateFormat) => void;
  setWeekStart: (day: WeekStart) => void;
  setWeeklyGoal: (goal: number) => void;
};

const TIME_FORMAT_KEY = 'work-tracker-time-format';
const DATE_FORMAT_KEY = 'work-tracker-date-format';
const WEEK_START_KEY = 'work-tracker-week-start';
const WEEKLY_GOAL_KEY = 'work-tracker-weekly-goal';
const DEFAULT_WEEKLY_GOAL = 5;

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>('12h');

  const [dateFormat, setDateFormatState] = useState<DateFormat>('numeric_us');

  const [weekStart, setWeekStartState] = useState<WeekStart>('sunday');

  const [weeklyGoal, setWeeklyGoalState] = useState<number>(DEFAULT_WEEKLY_GOAL);

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

    AsyncStorage.getItem(WEEKLY_GOAL_KEY).then(value => {
      const parsed = value ? Number.parseInt(value, 10) : NaN;

      if (Number.isFinite(parsed) && parsed > 0) {
        setWeeklyGoalState(parsed);
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

  const setWeeklyGoal = (goal: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(goal)));

    setWeeklyGoalState(clamped);
    AsyncStorage.setItem(WEEKLY_GOAL_KEY, String(clamped));
  };

  const value = useMemo(
    () => ({
      timeFormat,
      dateFormat,
      weekStart,
      weeklyGoal,
      setTimeFormat,
      setDateFormat,
      setWeekStart,
      setWeeklyGoal,
    }),
    [timeFormat, dateFormat, weekStart, weeklyGoal],
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
