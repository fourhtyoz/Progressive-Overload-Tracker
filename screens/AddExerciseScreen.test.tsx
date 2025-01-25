import React from 'react';
import { render } from '@testing-library/react-native';
import AddExerciseScreen from './AddExerciseScreen'

jest.mock('mobx-react-lite', () => ({
  observer: jest.fn((component) => component),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// Mock external dependencies
jest.mock('../services/db', () => ({
  addExercise: jest.fn(),
}));

describe('<AddExerciseScreen />', () => {
  let navigation: any;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<AddExerciseScreen navigation={navigation} route={navigation.route} />);
    expect(getByTestId('result-muscle')).toBeTruthy();
    expect(getByTestId('result-title')).toBeTruthy();
    expect(getByTestId('result-createExercise')).toBeTruthy();
  });

  it('disables the save button when fields are empty', () => {
    const { getByTestId } = render(<AddExerciseScreen navigation={navigation} route={navigation.route} />);
    const saveButton = getByTestId('result-createExercise');
    expect(saveButton.props.accessibilityState.disabled).toBe(true);
  });

});
