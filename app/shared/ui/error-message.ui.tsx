import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { Text, XStack } from 'tamagui';

import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';

type ErrorMessageProps = {
    message: string;
    setError: (value: string) => void;
};

export default function ErrorMessage({ message, setError }: ErrorMessageProps) {
    const { t } = useTranslation();
    const fontSize = useFontSize();
    return (
        <XStack
            padding={16}
            borderRadius={8}
            backgroundColor={COLORS.errorBackground}
            borderWidth={1}
            borderColor={COLORS.errorBorder}
            alignItems="center"
            justifyContent="space-between"
            accessibilityRole="alert"
            accessibilityLabel={`${t('errors.errorPrefix')} ${message}`}
        >
            <Text
                style={{ color: COLORS.errorText }}
                fontSize={fontSize.normal}
                fontWeight="600"
                flex={1}
            >
                {t('errors.errorPrefix')} {message}
            </Text>
            <TouchableOpacity
                onPress={() => setError('')}
                style={{ marginLeft: 8 }}
                testID="close-button"
                accessibilityRole="button"
                accessibilityLabel={t('errors.dismissError')}
            >
                <Ionicons name="close" size={20} color={COLORS.errorText} />
            </TouchableOpacity>
        </XStack>
    );
}
