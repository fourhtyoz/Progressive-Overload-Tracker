import { createAnimations } from '@tamagui/animations-react-native';
import { shorthands } from '@tamagui/shorthands';
import { themes } from '@tamagui/themes';
import { createFont,createTamagui } from 'tamagui';

import { COLORS } from './global-styles';

const animations = createAnimations({
    bouncy: {
        type: 'spring',
        damping: 10,
        mass: 0.9,
        stiffness: 100,
    },
    lazy: {
        type: 'spring',
        damping: 20,
        stiffness: 60,
    },
    quick: {
        type: 'spring',
        damping: 20,
        mass: 1.2,
        stiffness: 250,
    },
});

const headingFont = createFont({
    family: 'System',
    size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 20,
        6: 24,
        7: 28,
    },
    weight: {
        1: '400',
        2: '500',
        3: '600',
        4: '700',
    },
    lineHeight: {
        1: 18,
        2: 21,
        3: 24,
        4: 27,
        5: 30,
        6: 36,
        7: 42,
    },
});

const bodyFont = createFont({
    family: 'System',
    size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
    },
    weight: {
        1: '400',
        2: '500',
        3: '600',
    },
    lineHeight: {
        1: 18,
        2: 21,
        3: 24,
        4: 27,
    },
});

export const config = createTamagui({
    animations,
    shorthands,
    themes: {
        light: {
            ...themes.light,
            background: COLORS.backgroundLight,
            backgroundStrong: COLORS.white,
            backgroundSubtle: COLORS.backgroundLightSecondary,
            color: COLORS.black,
            colorMuted: COLORS.textSecondary,
            colorStrong: COLORS.black,
            borderLight: COLORS.borderLight,
            primary: COLORS.orange,
            error: COLORS.red,
            success: COLORS.green,
        },
        dark: {
            ...themes.dark,
            background: COLORS.backgroundDark,
            backgroundStrong: COLORS.darkGrey,
            backgroundSubtle: COLORS.darkDarkGrey,
            color: COLORS.textDarkScreen,
            colorMuted: COLORS.gray,
            colorStrong: COLORS.white,
            borderLight: COLORS.darkGrey,
            primary: COLORS.orange,
            error: COLORS.red,
            success: COLORS.green,
        },
    },
    tokens: {
        colors: {
            black: COLORS.black,
            white: COLORS.white,
            orange: COLORS.orange,
            gray: COLORS.gray,
            red: COLORS.red,
            green: COLORS.green,
            backgroundLight: COLORS.backgroundLight,
            backgroundDark: COLORS.backgroundDark,
            textSecondary: COLORS.textSecondary,
            borderLight: COLORS.borderLight,
        },
        space: {
            1: 4,
            2: 8,
            3: 12,
            4: 16,
            5: 20,
            6: 24,
            7: 32,
            8: 40,
        },
        radius: {
            1: 4,
            2: 8,
            3: 12,
            4: 16,
            5: 20,
            6: 24,
        },
    },
    fonts: {
        heading: headingFont,
        body: bodyFont,
    },
});

export type AppConfig = typeof config;

declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig {}
}
