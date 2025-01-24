import React from 'react';
import { render } from '@testing-library/react-native';
import AboutScreen from './AboutScreen';

// Mock `useTranslation` hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'about.definitionTitle': 'Definition',
        'about.definitionContent': 'Definition Content',
        'about.conceptTitle': 'Concept',
        'about.conceptContent': 'Concept Content',
        'about.methodsTitle': 'Methods',
        'about.methodsContent': 'Methods Content',
        'about.importanceTitle': 'Importance',
        'about.importanceContent': 'Importance Content',
        'about.exampleTitle': 'Example',
        'about.exampleContent': 'Example Content',
        'about.tipsTitle': 'Tips',
        'about.tipsContent': 'Tips Content',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the `settingsStore`
jest.mock('@/store/store', () => ({
  settingsStore: {
    isDark: false, // Default to light mode for testing
  },
}));

describe('AboutScreen', () => {
  it('renders correctly with all sections', () => {
    const { getByText } = render(<AboutScreen />);

    // Check for each section title and content
    expect(getByText('Definition')).toBeTruthy();
    expect(getByText('Definition Content')).toBeTruthy();
    expect(getByText('Concept')).toBeTruthy();
    expect(getByText('Concept Content')).toBeTruthy();
    expect(getByText('Methods')).toBeTruthy();
    expect(getByText('Methods Content')).toBeTruthy();
    expect(getByText('Importance')).toBeTruthy();
    expect(getByText('Importance Content')).toBeTruthy();
    expect(getByText('Example')).toBeTruthy();
    expect(getByText('Example Content')).toBeTruthy();
    expect(getByText('Tips')).toBeTruthy();
    expect(getByText('Tips Content')).toBeTruthy();
  });

  it('applies light mode styles when isDark is false', () => {
    const { getByText } = render(<AboutScreen />);

    // Check if the title in light mode uses the correct color
    const definitionTitle = getByText('Definition');
    expect(definitionTitle.props.style).toContainEqual({ color: '#333' });
  });
});
