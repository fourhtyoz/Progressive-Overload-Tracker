import { useTranslation } from 'react-i18next';
import { Button as TamaguiButton } from 'tamagui';

import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';

type Props = {
    fn: () => void;
};

export default function GoBackButton({ fn }: Props) {
    const { t } = useTranslation();
    const isDark = settingsStore.isDark;
    const fontSize = useFontSize();

    return (
        <TamaguiButton
            onPress={fn}
            accessibilityRole="button"
            accessibilityLabel={t('general.goBackButton')}
            chromeless
            backgroundColor={isDark ? COLORS.black : COLORS.orange}
            color={isDark ? COLORS.white : COLORS.black}
            marginRight={10}
            padding={10}
            borderRadius={5}
            pressStyle={{
                backgroundColor: isDark ? COLORS.orange : COLORS.black,
            }}
            fontSize={fontSize.large}
            fontWeight="bold"
            letterSpacing={0.25}
        >
            {t('general.goBackButton')}
        </TamaguiButton>
    );
}
