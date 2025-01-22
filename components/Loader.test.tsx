import React from 'react';
import { render } from '@testing-library/react-native';
import Loader from './Loader';

describe('Loader Component', () => {
    it('should render the Loader component correctly', () => {
        const { getByTestId } = render(<Loader />);
        const activityIndicator = getByTestId('activity-indicator');

        expect(activityIndicator).toBeTruthy();
    });

    it('should have correct styles applied', () => {
        const { getByTestId } = render(<Loader />);
        const container = getByTestId('loader-container');

        expect(container.props.style).toMatchObject([{"alignItems": "center", "backgroundColor": "#000", "flex": 1, "justifyContent": "center"}, {"backgroundColor": "rgba(0, 0, 0, .1)"}]);
    });
});
