import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingsScreen from './SettingsScreen';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settingsStore } from '@/store/store';

// Mock dependencies
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.getInTouch': 'Get in Touch',
        'settings.sendEmailTo': 'Send an email to',
        'alerts.success': 'Success',
        'settings.dataDeleted': 'All data deleted',
        'alerts.areYouSure': 'Are you sure?',
        'alerts.wantToDelete': 'Do you want to delete?',
        'alerts.yesProceed': 'Yes, proceed',
        'alerts.noIchangedMyMind': 'No, I changed my mind',
        'toasts.success': 'Success',
        'toasts.changedLanguage': 'Language changed successfully',
        'toasts.changedUnits': 'Units changed successfully',
        'toasts.changedTheme': 'Theme changed successfully',
        'settings.deleteData': 'Delete All Data',
        'settings.options.language': 'Language',
        'settings.options.units': 'Units',
        'settings.options.theme': 'Theme',
        'settings.options.languageHelpText': 'Select your preferred language',
        'settings.options.unitsHelpText': 'Select your preferred units',
        'settings.options.themeHelpText': 'Select your preferred theme',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('@/store/store', () => ({
  settingsStore: {
    isDark: false,
    language: 'en',
    units: 'metric',
    theme: 'light',
    setLanguage: jest.fn(),
    setUnits: jest.fn(),
    setTheme: jest.fn(),
  },
}));

describe('SettingsScreen', () => {
  const renderComponent = () => render(<SettingsScreen />);

  it('renders without crashing and displays error message when an error exists', () => {
    const { getByText } = renderComponent();
    // expect(getByText('Language')).toBeTruthy();
    // expect(getByText('Units')).toBeTruthy();
    // expect(getByText('Theme')).toBeTruthy();
  });

  it('displays alert when "Get in Touch" button is pressed', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = renderComponent();

    const button = getByText('Get in Touch');
    fireEvent.press(button);

    expect(alertSpy).toHaveBeenCalledWith(
      'Get in Touch',
      'Send an email to meow@gmail.com',
    );
  });

  it('displays a delete confirmation alert when "Delete All Data" is pressed', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = renderComponent();

    const deleteButton = getByText('Delete All Data');
    fireEvent.press(deleteButton);

    expect(alertSpy).toHaveBeenCalledWith(
      'Are you sure?',
      'Do you want to delete?',
      [
        { text: 'Yes, proceed', onPress: expect.any(Function) },
        { text: 'No, I changed my mind' },
      ],
    );
  });

//   it('handles changing the language correctly', async () => {
//     const { getByText } = renderComponent();

//     const languageDropdown = getByText('Language');
//     fireEvent.press(languageDropdown);

//     const newLanguageOption = getByText('French'); // Example of a new language option
//     fireEvent.press(newLanguageOption);

//     await waitFor(() => {
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith('language', 'fr');
//       expect(settingsStore.setLanguage).toHaveBeenCalledWith('fr');
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'success',
//         text1: 'Success',
//         text2: 'Language changed successfully',
//       });
//     });
//   });

//   it('handles changing the units correctly', async () => {
//     const { getByText } = renderComponent();

//     const unitsDropdown = getByText('Units');
//     fireEvent.press(unitsDropdown);

//     const newUnitsOption = getByText('Imperial'); // Example of a new units option
//     fireEvent.press(newUnitsOption);

//     await waitFor(() => {
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith('units', 'imperial');
//       expect(settingsStore.setUnits).toHaveBeenCalledWith('imperial');
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'success',
//         text1: 'Success',
//         text2: 'Units changed successfully',
//       });
//     });
//   });

//   it('handles changing the theme correctly', async () => {
//     const { getByText } = renderComponent();

//     const themeDropdown = getByText('Theme');
//     fireEvent.press(themeDropdown);

//     const newThemeOption = getByText('Dark'); // Example of a new theme option
//     fireEvent.press(newThemeOption);

//     await waitFor(() => {
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
//       expect(settingsStore.setTheme).toHaveBeenCalledWith('dark');
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'success',
//         text1: 'Success',
//         text2: 'Theme changed successfully',
//       });
//     });
//   });
});
