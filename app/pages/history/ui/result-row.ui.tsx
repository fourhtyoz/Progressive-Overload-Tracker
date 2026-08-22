import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity } from 'react-native';
import { Text, XStack } from 'tamagui';

import { ProgressType } from '@/app/features/progress/progress.lib';
import { HistoryStackParamList } from '@/app/navigation/drawer.navigator';
import { getformattedDate } from '@/app/shared/lib/formatters.lib';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, FONT_SIZE } from '@/app/shared/theme/global-styles';

type ResultProps = {
    resultId: number;
    date: string;
    weight: number;
    reps: number;
    units: string;
    progress: ProgressType | 'new';
    deleteResult: (id: number) => void;
};

export default function Result({
    resultId,
    date,
    weight,
    reps,
    units,
    progress,
    deleteResult,
}: ResultProps) {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<HistoryStackParamList>>();

    const isDark = settingsStore.isDark;

    const progressColor =
        progress === 'worse'
            ? COLORS.red
            : progress === 'neutral'
              ? COLORS.orange
              : progress === 'better'
                ? COLORS.green
                : isDark
                  ? COLORS.darkGrey
                  : COLORS.white;

    const handleDeleteRecord = (id: number) => {
        Alert.alert(t('alerts.areYouSure'), t('alerts.sureToDeleteRecord'), [
            { text: t('alerts.yesProceed'), onPress: () => deleteResult(id) },
            { text: t('alerts.noIchangedMyMind') },
        ]);
    };

    const handlePressedRecord = (id: number) => {
        Alert.alert(t('alerts.chooseAction'), t('alerts.chooseActionMessage'), [
            { text: t('alerts.delete'), onPress: () => handleDeleteRecord(id) },
            {
                text: t('alerts.edit'),
                onPress: () => navigation.navigate('EditResult', { resultId: id }),
            },
            { text: t('alerts.close') },
        ]);
    };

    return (
        <XStack
            paddingVertical={8}
            borderBottomWidth={1}
            borderBottomColor={isDark ? COLORS.black : COLORS.borderLight}
            borderLeftWidth={5}
            borderLeftColor={progressColor}
        >
            <Text flex={1} textAlign="center" fontSize={FONT_SIZE.normal}
                color={isDark ? COLORS.textDarkScreen : COLORS.textSecondary}>
                {getformattedDate(date)}
            </Text>
            <Text flex={1} textAlign="center" fontSize={FONT_SIZE.normal}
                color={isDark ? COLORS.textDarkScreen : COLORS.textSecondary}>
                {weight ? `${weight} ${t('units.' + units)}` : '-'}
            </Text>
            <Text flex={1} textAlign="center" fontSize={FONT_SIZE.normal}
                color={isDark ? COLORS.textDarkScreen : COLORS.textSecondary}>
                {reps}
            </Text>
            <TouchableOpacity
                onPress={() => handlePressedRecord(resultId)}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                accessibilityRole="button"
                accessibilityLabel={t('errors.editResult')}
            >
                <Ionicons name="settings" color={COLORS.gray} size={18} />
            </TouchableOpacity>
        </XStack>
    );
}
