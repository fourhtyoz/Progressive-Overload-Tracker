import { fireEvent,render } from '@testing-library/react-native';
import React from 'react';

import { COLORS } from '@/app/shared/theme/global-styles';

import GoBackButton from '../shared/ui/go-back-button.ui';

describe('GoBackButton Component', () => {
    it('renders correctly with a title', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<GoBackButton fn={mockOnPress} />);

        const buttonText = getByText('Back');

        expect(buttonText).toBeTruthy();
    });

    it('renders correctly with default colors', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<GoBackButton fn={mockOnPress} />);

        const button = getByText('Back').parent?.parent;
        const buttonText = getByText('Back');

        expect(button?.props.style[1].backgroundColor).toBe(COLORS.orange);
        expect(buttonText.props.style[1].color).toBe(COLORS.black);
    });

    it('triggers onPress callback when pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<GoBackButton fn={mockOnPress} />);

        fireEvent.press(getByText('Back'));
        expect(mockOnPress).toHaveBeenCalled();
    });

    it('applies custom colors correctly', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<GoBackButton fn={mockOnPress} />);

        const button = getByText('Back').parent?.parent;
        const buttonText = getByText('Back');

        expect(button?.props.style[1].backgroundColor).toBe(COLORS.orange);
        expect(buttonText.props.style[1].color).toBe(COLORS.black);
    });
});
