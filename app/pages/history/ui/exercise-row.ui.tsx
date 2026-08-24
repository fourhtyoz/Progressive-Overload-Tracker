import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Input, Spinner, Text, XStack, YStack } from 'tamagui';

import {
    calcOneRepMax,
    getBestResult,
    getLatestResult,
    getPctChange,
    getProgress,
    ProgressType,
} from '@/app/features/progress/progress.lib';
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

export default observer(function Exercise({ id, title, type, sorting, setError }: ExerciseProps) {
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

    const results = exerciseStore.resultsCache.get(id);

    const filteredResults = useMemo(() => {
        if (!results) return [];
        return sorting === 'asc'
            ? [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            : [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [results, sorting]);

    const stats = useMemo(() => {
        if (!results || results.length === 0) return null;
        const best = getBestResult(results);
        const latest = getLatestResult(results);
        if (!best || !latest) return null;
        const vsPr =
            results.length > 1 ? getPctChange(calcOneRepMax(latest), calcOneRepMax(best)) : null;
        return { best, latest, vsPr };
    }, [results]);

    useEffect(() => {
        if (!results) {
            void exerciseStore.loadResults(id).then((res) => {
                if (!res.success) setError(res.error || '');
            });
        }
    }, [id, results, setError]);

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

    const startRename = () => {
        setNewTitle(title);
        setIsRenaming(true);
    };

    const cancelRename = () => {
        setIsRenaming(false);
        setNewTitle(title);
    };

    const saveRename = async () => {
        const trimmed = newTitle.trim();
        if (!trimmed) {
            setError(t('errors.titleCantBeEmpty'));
            return;
        }
        if (exerciseStore.isTitleTaken(trimmed, type, id)) {
            setError(t('errors.exerciseExists'));
            return;
        }
        const res = await exerciseStore.renameExercise(id, trimmed);
        if (res.success) {
            setIsRenaming(false);
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('toasts.exerciseRenamed'),
            });
        } else {
            setError(res.error || '');
        }
    };

    const handleDeleteExercise = async () => {
        const res = await exerciseStore.deleteExercise(id);
        if (res.success) {
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('toasts.exerciseDeleted'),
            });
        } else {
            setError(res.error || '');
        }
    };

    const confirmDelete = () => {
        Alert.alert(t('alerts.areYouSure'), t('alerts.sureToDeleteExercise'), [
            { text: t('alerts.yesProceed'), onPress: () => void handleDeleteExercise() },
            { text: t('alerts.noIchangedMyMind') },
        ]);
    };

    const isDark = settingsStore.isDark;
    const fontSize = useFontSize();
    const iconColor = isDark ? COLORS.textDarkScreen : COLORS.textSecondary;

    const formatSet = (set: TResult) =>
        set.weight
            ? `${set.sets} × ${set.weight} ${t('units.' + set.units)} × ${set.reps}`
            : `${set.sets} × ${t('result.bodyweight')} × ${set.reps}`;

    const formatPct = (value: number) => {
        const rounded = Math.round(value);
        return `${rounded > 0 ? '+' : ''}${rounded}%`;
    };

    return (
        <YStack
            marginBottom={20}
            borderRadius={8}
            padding={10}
            borderWidth={1}
            borderColor={COLORS.blackTransparentBorder}
            backgroundColor="$backgroundStrong"
        >
            <YStack>
                <XStack justifyContent="space-between" alignItems="center">
                    {isRenaming ? (
                        <XStack flex={1} gap={8} alignItems="center">
                            <Input
                                flex={1}
                                value={newTitle}
                                onChangeText={setNewTitle}
                                maxLength={50}
                                borderWidth={1}
                                borderColor={isDark ? COLORS.orange : COLORS.gray}
                                borderRadius={8}
                                padding={8}
                                fontSize={fontSize.large}
                                color="$color"
                            />
                            <TouchableOpacity
                                onPress={() => void saveRename()}
                                accessibilityRole="button"
                                accessibilityLabel={t('alerts.save')}
                            >
                                <Ionicons name="checkmark" size={24} color={iconColor} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={cancelRename}
                                accessibilityRole="button"
                                accessibilityLabel={t('alerts.close')}
                            >
                                <Ionicons name="close" size={24} color={iconColor} />
                            </TouchableOpacity>
                        </XStack>
                    ) : (
                        <YStack
                            flex={1}
                            onPress={() => setIsOpen((prev) => !prev)}
                            accessibilityRole="button"
                            accessibilityLabel={`${toTitleCase(title)} - ${isOpen ? t('history.collapse') : t('history.expand')}`}
                        >
                            <Text
                                fontSize={fontSize.large}
                                fontWeight="bold"
                                marginBottom={10}
                                color="$color"
                            >
                                {toTitleCase(title)} ({t('muscles.' + type)})
                            </Text>
                        </YStack>
                    )}

                    {!isRenaming && (
                        <XStack gap={12} alignItems="center">
                            <TouchableOpacity
                                onPress={startRename}
                                accessibilityRole="button"
                                accessibilityLabel={t('history.renameExercise')}
                            >
                                <Ionicons name="pencil-outline" size={20} color={iconColor} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={confirmDelete}
                                accessibilityRole="button"
                                accessibilityLabel={t('history.deleteExercise')}
                            >
                                <Ionicons name="trash-outline" size={20} color={iconColor} />
                            </TouchableOpacity>
                        </XStack>
                    )}

                    <TouchableOpacity
                        onPress={() => setIsOpen((prev) => !prev)}
                        accessibilityRole="button"
                        accessibilityLabel={isOpen ? t('history.collapse') : t('history.expand')}
                    >
                        <Ionicons
                            name={isOpen ? 'chevron-up' : 'chevron-down'}
                            size={24}
                            color={iconColor}
                        />
                    </TouchableOpacity>
                </XStack>

                {stats && (
                    <XStack gap={12} flexWrap="wrap" marginTop={4}>
                        <Text fontSize={fontSize.normal} color="$colorMuted">
                            {t('history.pr')} {formatSet(stats.best)}
                        </Text>
                        <Text fontSize={fontSize.normal} color="$colorMuted">
                            {t('history.last')} {formatSet(stats.latest)}
                        </Text>
                        {stats.vsPr !== null && (
                            <Text fontSize={fontSize.normal} color="$colorMuted">
                                {t('history.vsPr')} {formatPct(stats.vsPr)}
                            </Text>
                        )}
                    </XStack>
                )}

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
                            {t('history.table.header.sets')}
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
                            sets={item.sets}
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
