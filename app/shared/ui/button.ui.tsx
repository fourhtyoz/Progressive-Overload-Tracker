import { Button as TamaguiButton } from 'tamagui';

import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, FONT_SIZE } from '@/app/shared/theme/global-styles';

type Props = {
    onPress: () => void;
    text: string;
    disabled?: boolean;
    bgColor?: string;
    pressedBgColor?: string;
    borderColor?: string;
    pressedBorderColor?: string;
    textColor?: string;
    pressedTextColor?: string;
    testID?: string;
};

export default function Button({
    onPress,
    text,
    disabled = false,
    bgColor,
    textColor,
    borderColor,
    testID = '',
}: Props) {
    const isDark = settingsStore.isDark;

    return (
        <TamaguiButton
            testID={testID}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={text}
            disabledStyle={{
                opacity: 0.3,
            }}
            chromeless
            backgroundColor={bgColor ?? (isDark ? COLORS.white : COLORS.black)}
            color={textColor ?? (isDark ? COLORS.black : COLORS.white)}
            borderColor={borderColor ?? (isDark ? COLORS.white : COLORS.white)}
            borderWidth={1}
            borderRadius={5}
            paddingVertical={15}
            alignItems="center"
            justifyContent="center"
            pressStyle={{
                backgroundColor: bgColor ?? (isDark ? COLORS.black : COLORS.white),
                color: textColor ?? (isDark ? COLORS.white : COLORS.black),
                borderColor: borderColor ?? (isDark ? COLORS.white : COLORS.blackTransparentBorder),
            }}
            fontSize={FONT_SIZE.large}
            fontWeight="bold"
            letterSpacing={0.25}
        >
            {text}
        </TamaguiButton>
    );
}
