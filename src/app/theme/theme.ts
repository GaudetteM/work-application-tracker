export type ThemeMode = 'light' | 'dark' | 'system';

export type Theme = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  borderStrong: string;

  text: string;
  textSecondary: string;
  textMuted: string;
  textFaint: string;

  accent: string;
  accentText: string;

  inputBackground: string;

  employment: {
    fullTime: {
      background: string;
      text: string;
    };
    contract: {
      background: string;
      text: string;
    };
    partTime: {
      background: string;
      text: string;
    };
  };
};

export const lightTheme: Theme = {
  background: '#F7F7F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F1EF',
  border: '#E3E3E0',
  borderStrong: '#D9D9D5',

  text: '#181816',
  textSecondary: '#666660',
  textMuted: '#8A8A84',
  textFaint: '#A0A09A',

  accent: '#181816',
  accentText: '#FFFFFF',

  inputBackground: '#FFFFFF',

  employment: {
    fullTime: {
      background: '#E3F0E5',
      text: '#3E6946',
    },
    contract: {
      background: '#E3EAF3',
      text: '#45617F',
    },
    partTime: {
      background: '#F2ECDD',
      text: '#76633A',
    },
  },
};

export const darkTheme: Theme = {
  background: '#191918',
  surface: '#232321',
  surfaceSecondary: '#1E1E1C',
  border: '#353532',
  borderStrong: '#41413D',

  text: '#F1F1EE',
  textSecondary: '#B7B7B0',
  textMuted: '#91918A',
  textFaint: '#70706A',

  accent: '#F1F1EE',
  accentText: '#191918',

  inputBackground: '#292927',

  employment: {
    fullTime: {
      background: '#263A2B',
      text: '#9BC4A2',
    },
    contract: {
      background: '#283441',
      text: '#9CB7D4',
    },
    partTime: {
      background: '#3C3628',
      text: '#D0BC83',
    },
  },
};
