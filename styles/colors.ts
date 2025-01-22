import { Dimensions } from "react-native"

const { width } = Dimensions.get('window')

export const COLORS = {
    black: '#000',
    white: '#FFF',
    orange: '#FFC857',
    gray: '#a9a9a9',
    red: '#F93827',
    blackTransparentBorder: 'rgba(0, 0, 0, .1)',
    textDarkScreen: '#F5F5F5'
}

export const FONT_SIZE = {
    normal: width <= 360 ? 16 : 14,
    small: width <= 360 ? 14 : 12,
    large: width <= 360 ? 18 : 16,
    huge: width <= 360 ? 20 : 18, 
    lineHeight: width <= 360 ? 24 : 21
}