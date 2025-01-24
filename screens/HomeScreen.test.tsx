import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.result': 'Result',
        'home.about': 'About',
        'home.settings': 'Settings',
        'home.history': 'History',
      };
      return translations[key] || key;
    },
  }),
}));

describe('HomeScreen', () => {
  const mockedNavigate = jest.fn();

  const renderComponent = () =>
    render(<HomeScreen navigation={{ navigate: mockedNavigate }} />);

  it('renders all UI elements correctly', () => {
    const { getByText } = renderComponent();

    // Check for all cards' titles
    expect(getByText('Result')).toBeTruthy();
    expect(getByText('About')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });

  it('navigates to AddResult when the "Result" card is pressed', () => {
    const { getByText } = renderComponent();

    const resultCard = getByText('Result');
    fireEvent.press(resultCard);

    expect(mockedNavigate).toHaveBeenCalledWith('AddResult');
  });

  it('navigates to About when the "About" card is pressed', () => {
    const { getByText } = renderComponent();

    const aboutCard = getByText('About');
    fireEvent.press(aboutCard);

    expect(mockedNavigate).toHaveBeenCalledWith('About');
  });

  it('navigates to Settings when the "Settings" card is pressed', () => {
    const { getByText } = renderComponent();

    const settingsCard = getByText('Settings');
    fireEvent.press(settingsCard);

    expect(mockedNavigate).toHaveBeenCalledWith('Settings');
  });

  it('navigates to History when the "History" card is pressed', () => {
    const { getByText } = renderComponent();

    const historyCard = getByText('History');
    fireEvent.press(historyCard);

    expect(mockedNavigate).toHaveBeenCalledWith('History');
  });
});
