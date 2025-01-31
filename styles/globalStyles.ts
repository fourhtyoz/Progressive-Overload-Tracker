import { StyleSheet, Dimensions } from "react-native";
import { DefaultTheme, DarkTheme as DT } from '@react-navigation/native';


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
    textColorLight: '#555' 
}


export const LightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#f8f9fa',
        text: COLORS.black
    },
  };
  

export const DarkTheme = {
    ...DT,
    colors: {
        ...DT.colors,
        background: '#171717',
        text: COLORS.textDarkScreen
    },
};


export const FONT_SIZE = {
    normal: screenWidth <= 360 ? 16 : 14,
    small: screenWidth <= 360 ? 14 : 12,
    large: screenWidth <= 360 ? 18 : 16,
    huge: screenWidth <= 360 ? 20 : 18, 
    lineHeight: screenWidth <= 360 ? 24 : 21
};


export const globalStyles = StyleSheet.create({
    date: {
        marginEnd: 10
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: 'lightgray',
        borderRadius: 5,
        color: COLORS.black,
        fontSize: FONT_SIZE.normal
    },
    inputWithOption: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: 'lightgray',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        color: COLORS.black,
    },
    dropdownButtonStyle: {
        width: 45,
        height: 40,
        backgroundColor: COLORS.black,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },
    dropdownButtonTxtStyle: {
        color: COLORS.white,
    },
    dropdownButtonArrowStyle: {
        fontSize: FONT_SIZE.normal,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
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
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    itemWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15
    },
    inputLabel: {
        fontWeight: 'bold',
        width: screenWidth / 3,
        fontSize: FONT_SIZE.normal,
    },
    wrapper: {
        paddingHorizontal: 20,
    },
    exerciseText: {
        color: COLORS.black
    },
    exerciseTextPlaceholder: {
        color: '#a9a9a9'
    },
    buttonWrapper: {
        marginVertical: 15,
        gap: 15
    }
});