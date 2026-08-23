import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Spinner, Text, XStack, YStack } from 'tamagui';

import { getProgress, ProgressType } from '@/app/features/progress/progress.lib';
import Result from '@/app/pages/history/ui/result-row.ui';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';

type ExerciseProps = {
    id: number;
    title: string;
    type: string;
    sorting: string;
    setError: (error: string) => void;
};

export default observer(function Exercise({ id, title, type, sorting, setError }: ExerciseProps) {
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);

    const results = exerciseStore.resultsCache.get(id);

    const filteredResults = useMemo(() => {
        if (!results) return [];
        return sorting === 'asc'
            ? [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            : [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [results, sorting]);

    useEffect(() => {
        if (isOpen && !results) {
            void exerciseStore.loadResults(id).then((res) => {
                if (!res.success) setError(res.error || '');
            });
        }
    }, [isOpen, id, results, setError]);

    const handleDeleteResult = async (resultId: number) => {
        const res = await exerciseStore.deleteResult(resultId);
        if (res.success) {
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('alerts.recordDeleted'),
            });
        } else {
            Toast.show({
                type: 'error',
                text1: t('toasts.error'),
                text2: t('alerts.failedDeletingRecord'),
            });
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
            backgroundColor="$backgroundStrong"
        >
            <YStack
                onPress={() => setIsOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={`${toTitleCase(title)} - ${isOpen ? t('history.collapse') : t('history.expand')}`}
            >
                <XStack justifyContent="space-between" alignItems="center">
                    <Text
                        fontSize={fontSize.large}
                        fontWeight="bold"
                        marginBottom={10}
                        color="$color"
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
                        backgroundColor="$backgroundSubtle"
                        borderBottomColor={isDark ? COLORS.black : COLORS.borderLight}
                    >
                        <XStack width={24} />
                        <Text
                            flex={1}
                            textAlign="center"
                            fontSize={fontSize.normal}
                            fontWeight="bold"
                            color="$colorMuted"
                        >
                            {t('history.table.header.date')}
                        </Text>
                        <Text
                            flex={1}
                            textAlign="center"
                            fontSize={fontSize.normal}
                            fontWeight="bold"
                            color="$colorMuted"
                        >
                            {t('history.table.header.weight')}
                        </Text>
                        <Text
                            flex={1}
                            textAlign="center"
                            fontSize={fontSize.normal}
                            fontWeight="bold"
                            color="$colorMuted"
                        >
                            {t('history.table.header.reps')}
                        </Text>
                        <Text
                            flex={1}
                            textAlign="center"
                            fontSize={fontSize.normal}
                            fontWeight="bold"
                            color="$colorMuted"
                        >
                            {t('history.table.header.edit')}
                        </Text>
                    </XStack>
                )}
            </YStack>

            {isOpen && !results && <Spinner size="small" color={COLORS.orange} marginTop={10} />}

            {isOpen && results && filteredResults.length === 0 && (
                <YStack justifyContent="center" alignItems="center" padding={20}>
                    <Text fontSize={fontSize.large} color="$colorMuted">
                        {t('history.noResults')}
                    </Text>
                </YStack>
            )}

            {isOpen &&
                results &&
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
});
