import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GoBackButton from './GoBackButton';
import { COLORS } from '@/styles/colors';


describe('GoBackButton Component', () => {

    it('renders correctly with a title', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<GoBackButton fn={mockOnPress}/>);

        const buttonText = getByText('Go Back');

        expect(buttonText).toBeTruthy();
    });

    it('renders correctly with default colors', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<GoBackButton fn={mockOnPress}/>);

        const button = getByText('Go Back').parent?.parent;
        const buttonText = getByText('Go Back');

        expect(button.props.style[1].backgroundColor).toBe(COLORS.orange);
        expect(buttonText.props.style[1].color).toBe(COLORS.black);
    });

    it('triggers onPress callback when pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<GoBackButton fn={mockOnPress}/>);

        fireEvent.press(getByText('Go Back'));
        expect(mockOnPress).toHaveBeenCalled();
    });

    it('applies custom colors correctly', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<GoBackButton fn={mockOnPress}/>);

        const button = getByText('Go Back').parent?.parent;
        const buttonText = getByText('Go Back');

        expect(button.props.style[1].backgroundColor).toBe(COLORS.orange);
        expect(buttonText.props.style[1].color).toBe(COLORS.black);
    });
});
