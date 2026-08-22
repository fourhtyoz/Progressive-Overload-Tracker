import { useTranslation } from 'react-i18next';
import { Spinner, XStack } from 'tamagui';

import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';

export default function Loader() {
    const { t } = useTranslation();

    return (
        <XStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            backgroundColor={settingsStore.isDark ? COLORS.black : COLORS.blackTransparentBorder}
            testID="loader-container"
            accessibilityRole="progressbar"
            accessibilityLabel={t('errors.loading')}
        >
            <Spinner size="large" color={COLORS.orange} testID="activity-indicator" />
        </XStack>
    );
}
