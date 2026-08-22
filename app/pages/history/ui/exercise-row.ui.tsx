import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { Spinner, Text, XStack, YStack } from 'tamagui';

import { getProgress, ProgressType } from '@/app/features/progress/progress.lib';
import Result from '@/app/pages/history/ui/result-row.ui';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';
import { TResult } from '@/app/shared/types';

type ExerciseProps = {
    id: number;
    title: string;
    type: string;
    sorting: string;
    setError: (error: string) => void;
};

export default function Exercise({ id, title, type, sorting, setError }: ExerciseProps) {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<TResult[]>([]);

    const filteredResults = useMemo(
        () =>
            sorting === 'asc'
                ? [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                : [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [results, sorting]
    );

    useEffect(() => {
        const getResultsByExercise = async () => {
            setIsLoading(true);
            const res = await exerciseStore.fetchResultsByExerciseId(id);
            if (res.success && Array.isArray(res.data)) {
                setResults(res.data);
            } else {
                setError(res.error || '');
            }
            setIsLoading(false);
            setIsLoaded(true);
        };

        if (isOpen && !isLoaded) {
            void getResultsByExercise();
        }
    }, [isOpen, isLoaded, id, setError]);

    const handleDeleteResult = async (resultId: number) => {
        const res = await exerciseStore.deleteResult(resultId);
        if (res.success) {
            Alert.alert(t('alerts.success'), t('alerts.recordDeleted'));
            setResults((prevResults) => prevResults.filter((item) => item.id !== resultId));
        } else {
            Alert.alert(t('alerts.error'), t('alerts.failedDeletingRecord'));
        }
    };

    const isDark = settingsStore.isDark;
    const fontSize = useFontSize();

    return (
        <YStack
            marginBottom={20}
            borderRadius={8}
            padding={10}
            borderWidth={1}
            borderColor={COLORS.blackTransparentBorder}
            backgroundColor={isDark ? COLORS.darkGrey : COLORS.white}
        >
            <YStack
                onPress={() => setIsOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={`${toTitleCase(title)} - ${isOpen ? 'collapse' : 'expand'}`}
            >
                <XStack justifyContent="space-between" alignItems="center">
                    <Text
                        fontSize={fontSize.large}
                        fontWeight="bold"
                        marginBottom={10}
                        color={isDark ? COLORS.textDarkScreen : COLORS.textTitleColorLight}
                    >
                        {toTitleCase(title)} ({t('muscles.' + type)})
                    </Text>
                    <Ionicons
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={isDark ? COLORS.textDarkScreen : COLORS.textSecondary}
                    />
                </XStack>

                {isOpen && (
                    <XStack
                        paddingVertical={8}
                        borderBottomWidth={2}
                        borderTopRightRadius={5}
                        borderTopLeftRadius={5}
                        backgroundColor={isDark ? COLORS.darkDarkGrey : COLORS.backgroundLightSecondary}
                        borderBottomColor={isDark ? COLORS.black : COLORS.borderLight}
                    >
                        <Text flex={1} textAlign="center" fontSize={fontSize.normal} fontWeight="bold"
                            color={isDark ? COLORS.textDarkScreen : COLORS.textSecondary}>
                            {t('history.table.header.date')}
                        </Text>
                        <Text flex={1} textAlign="center" fontSize={fontSize.normal} fontWeight="bold"
                            color={isDark ? COLORS.textDarkScreen : COLORS.textSecondary}>
                            {t('history.table.header.weight')}
                        </Text>
                        <Text flex={1} textAlign="center" fontSize={fontSize.normal} fontWeight="bold"
                            color={isDark ? COLORS.textDarkScreen : COLORS.textSecondary}>
                            {t('history.table.header.reps')}
                        </Text>
                        <Text flex={1} textAlign="center" fontSize={fontSize.normal} fontWeight="bold"
                            color={isDark ? COLORS.textDarkScreen : COLORS.textSecondary}>
                            {t('history.table.header.edit')}
                        </Text>
                    </XStack>
                )}
            </YStack>

            {isOpen && isLoading && <Spinner size="small" color={COLORS.orange} marginTop={10} />}

            {isOpen && isLoaded && filteredResults.length === 0 && (
                <YStack justifyContent="center" alignItems="center" padding={20}>
                    <Text fontSize={16} color="$colorMuted">
                        {t('history.noResults')}
                    </Text>
                </YStack>
            )}

            {isOpen &&
                isLoaded &&
                filteredResults.map((item, index) => {
                    let progress: ProgressType | 'new' = 'new';

                    if (sorting === 'desc') {
                        if (index + 1 < filteredResults.length) {
                            const previousSet = filteredResults[index + 1];
                            progress = getProgress(item, previousSet);
                        }
                    } else {
                        if (index > 0) {
                            const previousSet = filteredResults[index - 1];
                            progress = getProgress(item, previousSet);
                        }
                    }

                    return (
                        <Result
                            key={item.id}
                            resultId={item.id}
                            date={item.date}
                            weight={item.weight}
                            reps={item.reps}
                            units={item.units}
                            progress={progress}
                            deleteResult={handleDeleteResult}
                        />
                    );
                })}
        </YStack>
    );
}
