import { DarkTheme as DT,DefaultTheme } from '@react-navigation/native';
import { Dimensions,StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const COLORS = {
    black: '#000',
    white: '#FFF',
    orange: '#FFC857',
    gray: '#a9a9a9',
    placeholderTextLight: '#a9a9a9',
    red: '#DC3545',
    green: '#16C47F',
    blackTransparentBorder: 'rgba(0, 0, 0, .1)',
    textDarkScreen: '#F5F5F5',
    selectedLight: '#D2D9DF',
    darkDarkGrey: '#282828',
    darkGrey: '#3f3f3f',
    textTitleColorDark: '#EDEDED',
    textColorDark: '#F5F5F5',
    textTitleColorLight: '#333',
    textColorLight: '#555',
    textSecondary: '#495057',
    borderLight: '#e9ecef',
    backgroundLightSecondary: '#f1f3f5',
    backgroundDark: '#171717',
    backgroundLight: '#f8f9fa',
    dropdownBackground: '#E9ECEF',
    dropdownText: '#151E26',
    disabledBackground: '#e0e0e0',
    errorBackground: '#f8d7da',
    errorBorder: '#f5c6cb',
    errorText: '#721c24',
    overlayDark: 'rgba(0, 0, 0, .4)',
};

export const LightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.backgroundLight,
        text: COLORS.black,
    },
};

export const DarkTheme = {
    ...DT,
    colors: {
        ...DT.colors,
        background: COLORS.backgroundDark,
        text: COLORS.textDarkScreen,
    },
};

export const FONT_SIZE = {
    normal: screenWidth <= 360 ? 16 : 14,
    small: screenWidth <= 360 ? 14 : 12,
    large: screenWidth <= 360 ? 18 : 16,
    huge: screenWidth <= 360 ? 20 : 18,
    lineHeight: screenWidth <= 360 ? 24 : 21,
};

export const globalStyles = StyleSheet.create({
    dropdownMenuStyle: {
        backgroundColor: COLORS.dropdownBackground,
        borderRadius: 8,
        width: 'auto' as const,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: FONT_SIZE.normal,
        fontWeight: '500',
        color: COLORS.dropdownText,
    },
});
