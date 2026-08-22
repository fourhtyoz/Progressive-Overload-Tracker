import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { settingsStore } from '@/app/store/settingsStore';
import { getProgress, toTitleCase } from '@/app/utils/utils';
import { useTranslation } from 'react-i18next';
import { FONT_SIZE, COLORS } from '@/app/styles/globalStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { exerciseStore } from '@/app/store/exerciseStore';
import Result from '@/app/components/Result';
import { TResult } from '@/app/types';
import { MUSCLES } from '@/app/constants/settings';

export default function Exercise({ id, title, type, sorting, setError }: any) {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<TResult[]>([]);

    const filteredResults =
        sorting === 'asc'
            ? results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            : results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // TODO: AbortController on closing the exercise
    useEffect(() => {
        const getResultsByExercise = async () => {
            setIsLoading(true);
            const res = await exerciseStore.fetchResultsByExerciseId(id);
            console.log('res', res)
            if (res.success && Array.isArray(res.data)) {
                setResults(res.data);
            } else {
                setError(res.error);
            }
            setIsLoading(false);
            setIsLoaded(true)
        };

        if (isOpen && !isLoaded) {
                getResultsByExercise();
        }
    }, [isOpen, isLoaded, isLoading, results, id, setError]);

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
                            {toTitleCase(title)} (
                            {MUSCLES.find((item) => item.title === type)?.[settingsStore.language]})
                        </Text>
                        <Text
                            style={{
                                color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057',
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
                                        : '#f1f3f5',
                                    borderBottomColor: settingsStore.isDark
                                        ? COLORS.black
                                        : '#e9ecef',
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
                                            : '#495057',
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
                                            : '#495057',
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
                                            : '#495057',
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
                                            : '#495057',
                                    },
                                ]}
                            >
                                {t('history.table.header.edit')}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                {isOpen && isLoading && <ActivityIndicator />}
                {isOpen && isLoaded &&
                    filteredResults.map((item, index, arr) => {
                        if (arr.length < 1) {
                            return (
                             <View style={s.notFound}>
                                <Text style={s.text}>{t('history.noResults')}</Text>
                            </View>
                            )
                        }

                        let progress = 'new';

                        if (sorting === 'desc') {
                            const len = results.length;
                            if (index + 1 < len) {
                                const previousSet = results[index + 1];
                                progress = getProgress(item, previousSet);
                            }
                        } else {
                            if (index > 0) {
                                const previousSet = results[index - 1];
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
        color: '#555',
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
