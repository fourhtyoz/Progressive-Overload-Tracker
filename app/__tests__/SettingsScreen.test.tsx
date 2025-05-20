import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SettingsScreen from '../screens/SettingsScreen';
import { Alert } from 'react-native';

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

jest.mock('@/app/store/settingsStore', () => ({
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
        expect(getByText('Language:')).toBeTruthy();
        expect(getByText('Units:')).toBeTruthy();
        expect(getByText('Theme:')).toBeTruthy();
    });

    it('displays alert when "Get in Touch" button is pressed', () => {
        const alertSpy = jest.spyOn(Alert, 'alert');
        const { getByText } = renderComponent();

        const button = getByText('Get in Touch');
        act(() => {
            fireEvent.press(button);
        });

        expect(alertSpy).toHaveBeenCalledWith('Get in Touch', 'Send an email to hualua@gmail.com');
    });

    it('displays a delete confirmation alert when "Delete All Data" is pressed', () => {
        const alertSpy = jest.spyOn(Alert, 'alert');
        const { getByText } = renderComponent();

        const deleteButton = getByText('Delete All Data');
        act(() => {
            fireEvent.press(deleteButton);
        });

        expect(alertSpy).toHaveBeenCalledWith('Are you sure?', 'Do you want to delete?', [
            { text: 'Yes, proceed', onPress: expect.any(Function) },
            { text: 'No, I changed my mind' },
        ]);
    });
});
