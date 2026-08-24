import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity } from 'react-native';
import { Text, XStack } from 'tamagui';

import { ProgressType } from '@/app/features/progress/progress.lib';
import { HistoryStackParamList } from '@/app/navigation/drawer.navigator';
import { getformattedDate } from '@/app/shared/lib/formatters.lib';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';

type ResultProps = {
    resultId: number;
    date: string;
    sets: number;
    weight: number;
    reps: number;
    units: string;
    progress: ProgressType | 'new';
    deleteResult: (id: number) => void;
};

export default function Result({
    resultId,
    date,
    sets,
    weight,
    reps,
    units,
    progress,
    deleteResult,
}: ResultProps) {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<HistoryStackParamList>>();

    const isDark = settingsStore.isDark;
    const fontSize = useFontSize();

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

    const progressIcon =
        progress === 'better'
            ? 'trending-up'
            : progress === 'worse'
              ? 'trending-down'
              : progress === 'neutral'
                ? 'remove'
                : undefined;

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
            <XStack width={24} alignItems="center" justifyContent="center">
                {progressIcon ? (
                    <Ionicons name={progressIcon} size={16} color={progressColor} />
                ) : null}
            </XStack>
            <Text flex={1} textAlign="center" fontSize={fontSize.normal} color="$colorMuted">
                {getformattedDate(date)}
            </Text>
            <Text flex={1} textAlign="center" fontSize={fontSize.normal} color="$colorMuted">
                {sets}
            </Text>
            <Text flex={1} textAlign="center" fontSize={fontSize.normal} color="$colorMuted">
                {weight ? `${weight} ${t('units.' + units)}` : '-'}
            </Text>
            <Text flex={1} textAlign="center" fontSize={fontSize.normal} color="$colorMuted">
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
