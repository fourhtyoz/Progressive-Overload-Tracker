import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { getProgress } from '@/app/features/progress/progress.lib';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { useTranslation } from 'react-i18next';
import { FONT_SIZE, COLORS } from '@/app/shared/theme/global-styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import Result from '@/app/pages/history/ui/result-row.ui';
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

    const filteredResults =
        sorting === 'asc'
            ? [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            : [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            getResultsByExercise();
        }
    }, [isOpen, isLoaded, id, setError]);

    const handleDeleteResult = async (resultId: number) => {
        const res = await exerciseStore.deleteResult(resultId);
        if (res.success) {
            Alert.alert(t('alerts.success'), t('alerts.recordDeleted'));

            setResults((prevResults) => {
                const updatedResults = prevResults.filter((item) => item.id !== resultId);
                return updatedResults;
            });
        } else {
            Alert.alert(t('alerts.error'), t('alerts.failedDeletingRecord'));
        }
    };

    return (
        <>
            <View
                style={[
                    s.exerciseSection,
                    { backgroundColor: settingsStore.isDark ? COLORS.darkGrey : COLORS.white },
                ]}
            >
                <TouchableOpacity onPress={() => setIsOpen((prev) => !prev)}>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={[
                                s.exerciseHeader,
                                {
                                    color: settingsStore.isDark
                                        ? COLORS.textDarkScreen
                                        : COLORS.textTitleColorLight,
                                },
                            ]}
                        >
                            {toTitleCase(title)} ({t('muscles.' + type)})
                        </Text>
                        <Text
                            style={{
                                color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.textSecondary,
                                fontSize: 20,
                            }}
                        >
                            {isOpen ? '↑' : '↓'}
                        </Text>
                    </View>
                    {isOpen && (
                        <View
                            style={[
                                s.row,
                                s.headerRow,
                                {
                                    backgroundColor: settingsStore.isDark
                                        ? COLORS.darkDarkGrey
                                        : COLORS.backgroundLightSecondary,
                                    borderBottomColor: settingsStore.isDark
                                        ? COLORS.black
                                        : COLORS.borderLight,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    s.cell,
                                    s.headerCell,
                                    {
                                        color: settingsStore.isDark
                                            ? COLORS.textDarkScreen
                                            : COLORS.textSecondary,
                                    },
                                ]}
                            >
                                {t('history.table.header.date')}
                            </Text>
                            <Text
                                style={[
                                    s.cell,
                                    s.headerCell,
                                    {
                                        color: settingsStore.isDark
                                            ? COLORS.textDarkScreen
                                            : COLORS.textSecondary,
                                    },
                                ]}
                            >
                                {t('history.table.header.weight')}
                            </Text>
                            <Text
                                style={[
                                    s.cell,
                                    s.headerCell,
                                    {
                                        color: settingsStore.isDark
                                            ? COLORS.textDarkScreen
                                            : COLORS.textSecondary,
                                    },
                                ]}
                            >
                                {t('history.table.header.reps')}
                            </Text>
                            <Text
                                style={[
                                    s.cell,
                                    s.headerCell,
                                    {
                                        color: settingsStore.isDark
                                            ? COLORS.textDarkScreen
                                            : COLORS.textSecondary,
                                    },
                                ]}
                            >
                                {t('history.table.header.edit')}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                {isOpen && isLoading && <ActivityIndicator />}
                {isOpen && isLoaded && filteredResults.length === 0 && (
                    <View style={s.notFound}>
                        <Text style={s.text}>{t('history.noResults')}</Text>
                    </View>
                )}
                {isOpen && isLoaded &&
                    filteredResults.map((item, index) => {
                        let progress = 'new';

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
            </View>
        </>
    );
}

const s = StyleSheet.create({
    notFound: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    text: {
        marginTop: 20,
        fontSize: 16,
        color: COLORS.textColorLight,
    },
    exerciseSection: {
        marginBottom: 20,
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.blackTransparentBorder,
    },
    exerciseHeader: {
        fontSize: FONT_SIZE.large,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    headerRow: {
        borderBottomWidth: 2,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: FONT_SIZE.normal,
    },
    headerCell: {
        fontWeight: 'bold',
    },
});
