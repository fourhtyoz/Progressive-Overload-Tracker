import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  const mockSetError = jest.fn(); // Mock function for setError

  it('renders correctly with a message', () => {
    const { getByText } = render(<ErrorMessage message="Test error message" setError={mockSetError} />);

    // Check if the message is displayed
    expect(getByText('Error: Test error message')).toBeTruthy();
  });

  it('calls setError with an empty string when close button is pressed', () => {
    const { getByTestId } = render(<ErrorMessage message="Test error message" setError={mockSetError} />);

    // Find the TouchableOpacity by testID and simulate a press
    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);

    // Check if setError was called with an empty string
    expect(mockSetError).toHaveBeenCalledTimes(1);
    expect(mockSetError).toHaveBeenCalledWith('');
  });

  it('applies the correct styles', () => {
    const { getByText } = render(<ErrorMessage message="Test error message" setError={mockSetError} />);

    // Check if the text has the correct styles
    const textElement = getByText('Error: Test error message');
    expect(textElement).toHaveStyle({ color: '#721c24', fontWeight: '600' });
  });
});
