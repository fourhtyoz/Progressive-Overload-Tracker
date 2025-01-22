import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';
import { COLORS } from '@/styles/colors';


describe('Button Component', () => {
    it('renders correctly with a given text', () => {
        const { getByText } = render(<Button onPress={() => {}} text="Press Me" />);

        const buttonText = getByText('Press Me');

        expect(buttonText).toBeTruthy();
    });

    it('renders correctly with default colors', () => {
        const { getByText } = render(<Button onPress={() => {}} text="Press Me" />);

        const button = getByText('Press Me').parent?.parent;
        const buttonText = getByText('Press Me')

        expect(button?.props.style[1].backgroundColor).toBe(COLORS.black);
        expect(button?.props.style[1].borderColor).toBe(COLORS.white);
        expect(buttonText?.props.style[1].color).toBe(COLORS.white);
    });

    it('triggers onPress callback when pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<Button onPress={mockOnPress} text="Press Me" />);

        fireEvent.press(getByText('Press Me'));
        expect(mockOnPress).toHaveBeenCalled();
    });

    it('applies custom colors correctly', () => {
        const { getByText } = render(
            <Button
                onPress={() => {}}
                text="Press Me"
                bgColor="blue"
                pressedBgColor="green"
                borderColor="red"
                pressedBorderColor="yellow"
                textColor="pink"
                pressedTextColor="purple"
            />
        );

        const button = getByText('Press Me').parent?.parent
        const buttonText = getByText('Press Me');

        expect(button?.props.style[1].backgroundColor).toBe('blue');
        expect(button?.props.style[1].borderColor).toBe('red');
        expect(buttonText?.props.style[1].color).toBe('pink');
    });
});
