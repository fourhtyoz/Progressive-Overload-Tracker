import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Text, XStack } from 'tamagui';

import { COLORS, FONT_SIZE } from '@/app/shared/theme/global-styles';

type ErrorMessageProps = {
    message: string;
    setError: (value: string) => void;
};

export default function ErrorMessage({ message, setError }: ErrorMessageProps) {
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
            accessibilityLabel={`Error: ${message}`}
        >
            <Text
                style={{ color: COLORS.errorText }}
                fontSize={FONT_SIZE.normal}
                fontWeight="600"
                flex={1}
            >
                Error: {message}
            </Text>
            <TouchableOpacity
                onPress={() => setError('')}
                style={{ marginLeft: 8 }}
                testID="close-button"
                accessibilityRole="button"
                accessibilityLabel="Dismiss error"
            >
                <Ionicons name="close" size={20} color={COLORS.errorText} />
            </TouchableOpacity>
        </XStack>
    );
}
