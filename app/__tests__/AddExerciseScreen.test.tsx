import { render } from '@testing-library/react-native';
import React from 'react';

import AddExerciseScreen from '../pages/add-exercise/add-exercise.ui';

jest.mock('mobx-react-lite', () => ({
    observer: jest.fn((component) => component),
}));

jest.mock('react-native-toast-message', () => ({
    show: jest.fn(),
}));

// Mock external dependencies
jest.mock('@/app/shared/api/db', () => ({
    fetchExercises: jest.fn(() => Promise.resolve({ success: true, data: [], error: '' })),
    exerciseExist: jest.fn(() => Promise.resolve(false)),
    addExercise: jest.fn(() => Promise.resolve({ success: true, data: 1, error: '' })),
    addResult: jest.fn(),
    updateResult: jest.fn(),
    deleteResult: jest.fn(),
    fetchResultById: jest.fn(),
    fetchResultsByExerciseId: jest.fn(),
}));

describe('AddExerciseScreen', () => {
    let navigation: any;

    beforeEach(() => {
        navigation = { navigate: jest.fn() };
    });

    it('renders correctly', () => {
        const { getByTestId } = render(
            <AddExerciseScreen navigation={navigation} route={navigation.route} />
        );
        expect(getByTestId('result-muscle')).toBeTruthy();
        expect(getByTestId('result-title')).toBeTruthy();
        expect(getByTestId('result-createExercise')).toBeTruthy();
    });

    it('disables the save button when fields are empty', () => {
        const { getByTestId } = render(
            <AddExerciseScreen navigation={navigation} route={navigation.route} />
        );
        const saveButton = getByTestId('result-createExercise');
        expect(saveButton.props.accessibilityState.disabled).toBe(true);
    });
});
