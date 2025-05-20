import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import HistoryScreen from '../screens/HistoryScreen';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SelectDropdown from 'react-native-select-dropdown';
import { settingsStore } from '@/app/store/settingsStore';
import { fetchExercises } from '@/app/services/db';
import Loader from '@/app/components/Loader';
import ErrorMessage from '@/app/components/ErrorMessage';
import Exercise from '@/app/components/Exercise';

jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn(),
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


describe('HistoryScreen', () => {
    const mockedNavigate = jest.fn();
    const mockExercises = [
        { id: 1, title: 'Bench Press', type: 'chest' },
        { id: 2, title: 'Squat', type: 'legs' },
        { id: 3, title: 'Deadlift', type: 'back' },
    ];

    beforeEach(() => {
        Loader.mockImplementation(() => <></>);
    })
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
      render(<HistoryScreen navigation={{ navigate: mockedNavigate }} />);

  it('renders loading state initially', async () => {
    const { getByTestId } = renderComponent();
    // expect(getByTestId('result-muscle')).toBeTruthy();
    // expect(getByTestId('result-title')).toBeTruthy();
    // expect(getByTestId('result-createExercise')).toBeTruthy();
  });

//   it('fetches exercises on focus', async () => {
//     await act(async () => {
//       render(<HistoryScreen />);
//     });
    
//     expect(fetchExercises).toHaveBeenCalledTimes(1);
//   });

//   it('displays error message when fetch fails', async () => {
//     const error = new Error('Failed to fetch');
    
//     await act(async () => {
//       render(<HistoryScreen />);
//     });
    
//     expect(ErrorMessage).toHaveBeenCalledWith(
//       expect.objectContaining({
//         message: `errors.failedFetchResults ${error}`,
//       }),
//       expect.anything()
//     );
//   });

//   it('renders exercise list after successful fetch', async () => {
//     await act(async () => {
//       render(<HistoryScreen />);
//     });
    
//     expect(Exercise).toHaveBeenCalledTimes(mockExercises.length);
//   });

//   it('filters exercises by selected muscle type', async () => {
//     const { getByTestId } = await act(async () => {
//       return render(<HistoryScreen />);
//     });
    
//     // Find and select the chest muscle filter
//     const chestFilter = getByTestId('dropdown-item-0'); // Assuming chest is first in muscleOptions
//     await act(async () => {
//       fireEvent.press(chestFilter);
//     });
    
//     // Only chest exercises should be rendered
//     expect(Exercise).toHaveBeenCalledTimes(
//       mockExercises.filter(ex => ex.type === 'chest').length
//     );
//   });

//   it('changes sorting option', async () => {
//     const { getByTestId } = await act(async () => {
//       return render(<HistoryScreen />);
//     });
    
//     // Find and select the oldest first sorting option
//     const oldestFirstOption = getByTestId('dropdown-item-1'); // Assuming it's the second option
//     await act(async () => {
//       fireEvent.press(oldestFirstOption);
//     });
    
//     // Verify Exercise components are called with the correct sorting prop
//     expect(Exercise).toHaveBeenCalledWith(
//       expect.objectContaining({
//         sorting: 'asc', // 'asc' is the type for oldest first
//       }),
//       expect.anything()
//     );
//   });

//   it('resets filters when reset button is pressed', async () => {
//     const { getByText } = await act(async () => {
//       return render(<HistoryScreen />);
//     });
    
//     // First select a filter
//     const chestFilter = getByTestId('dropdown-item-0');
//     await act(async () => {
//       fireEvent.press(chestFilter);
//     });
    
//     // Then reset
//     const resetButton = getByText('history.resetFilter');
//     await act(async () => {
//       fireEvent.press(resetButton);
//     });
    
//     // All exercises should be rendered again
//     expect(Exercise).toHaveBeenCalledTimes(mockExercises.length);
//   });

//   it('disables reset button when no filters are selected', async () => {
//     const { getByText } = await act(async () => {
//       return render(<HistoryScreen />);
//     });
    
//     const resetButton = getByText('history.resetFilter').parent;
//     expect(resetButton.props.style).toContainEqual(
//       expect.objectContaining({
//         opacity: 0.5,
//       })
//     );
//   });
});