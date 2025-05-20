import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import EditResultScreen from '../screens/EditResultScreen';
import { Alert } from 'react-native';
import { fetchResultById } from '@/app/services/db';

// Mocking modules
jest.mock('../services/db', () => ({
    updateResult: jest.fn(),
}));

jest.mock('../services/db', () => ({
    fetchExercises: jest.fn(() => Promise.resolve([{ title: 'Squats', type: 'Legs' }])),
    fetchResultById: jest.fn(() =>
        Promise.resolve({
            date: '2025-01-31T12:54:21.512Z',
            exercise: 'Squats',
            exercise_id: 4,
            id: 8,
            muscleGroup: 'Legs',
            reps: 22,
            units: 'kg',
            weight: 31,
        })
    ),
}));

jest.mock('react-native-toast-message', () => ({
    Toast: {
        show: jest.fn(),
    },
}));

jest.spyOn(Alert, 'alert');

describe('EditResultScreen', () => {
    const mockNavigation = { navigate: jest.fn() };
    const mockRoute = {
        params: {
            id: '1',
            date: new Date().toISOString(),
            exercise: 'Squats',
            muscleGroup: 'Legs',
            reps: 10,
            weight: 50,
            units: 'kg',
        },
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly and fetches exercises', async () => {
        const { findByText } = render(
            <EditResultScreen navigation={mockNavigation} route={mockRoute} />
        );

        expect(await findByText('Legs')).toBeTruthy(); // Muscle group dropdown
        expect(await findByText('Squats')).toBeTruthy(); // Exercise dropdown
        expect(await findByText('kg')).toBeTruthy(); // Exercise dropdown
    });

    it('displays an error for invalid reps input', async () => {
        const { getByTestId, getByText } = render(
            <EditResultScreen navigation={mockNavigation} route={mockRoute} />
        );

        await waitFor(() => {
            const repsInput = getByTestId('input-reps');
            expect(repsInput).toBeTruthy();
        });

        act(() => {
            fireEvent.changeText(getByTestId('input-reps'), '-5');
        });

        await waitFor(() => {
            expect(getByText('Error: Repetitions must be greater than 0')).toBeTruthy();
        });
    });

    it('displays an error for invalid weight input', async () => {
        const { getByTestId, getByText } = render(
            <EditResultScreen navigation={mockNavigation} route={mockRoute} />
        );

        await waitFor(() => {
            const weightInput = getByTestId('input-weight');
            expect(weightInput).toBeTruthy();
        });

        act(() => {
            fireEvent.changeText(getByTestId('input-weight'), 'abc');
        });

        await waitFor(() => {
            expect(getByText('Error: Weight must be a number')).toBeTruthy();
        });
    });
});
