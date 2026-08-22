import { useWindowDimensions } from 'react-native';

export function useFontSize() {
    const { width } = useWindowDimensions();

    return {
        normal: width <= 360 ? 16 : 14,
        small: width <= 360 ? 14 : 12,
        large: width <= 360 ? 18 : 16,
        huge: width <= 360 ? 20 : 18,
        lineHeight: width <= 360 ? 24 : 21,
    };
}
