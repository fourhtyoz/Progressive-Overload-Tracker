import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { toTitleCase, groupByExercise, filterByMuscleGroup, getformattedDate, getProgress } from '@/utils/helpFunctions';
import SelectDropdown from 'react-native-select-dropdown';
import { COLORS, FONT_SIZE } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { fetchResults, deleteResult } from '@/services/db';
import { GroupedResult, Result } from '@/utils/types';
import ErrorMessage from '@/components/ErrorMessage';
import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import { settingsStore } from '@/store/store';
import Loader from '@/components/Loader';
import { MUSCLES, UNITS } from '@/constants/settings';


type Props = DrawerScreenProps<DrawerParamList, 'History'>;


export default function HistoryScreen({ navigation } : Props) {
    const { t } = useTranslation();

    const [results, setResults] = useState<GroupedResult[]>([]);
    const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
    const [selectedExercise, setSelectedExercise] = useState('All');
    const [muscleOptions, setMuscleOptions] = useState<string[]>([]);
    const [selectedMuscle, setSelectedMuscle] = useState('All');
    const [selectedSorting, setSelectedSorting] = useState({title: t('history.byDateRecentFirst'), type: 'desc'});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const resetFilters = () => {
        setSelectedExercise('All');
        setSelectedMuscle('All');
    };

    const isResetDisabled = selectedExercise === 'All' && selectedMuscle === 'All'

    useFocusEffect(
        useCallback(() => {
            getResults()
            
            return () => {
                setResults([])
                setExerciseOptions([]);
                setMuscleOptions([]);
                setSelectedExercise('All')
                setSelectedMuscle('All')
                setError('')
            }
        }, [selectedSorting])
    )

    const getResults = async () => {
        setIsLoading(true)
        try {
            const res = await fetchResults(selectedSorting.type);
            if (!Array.isArray(res)) {
                throw new Error('fetchResults returned no array')
            }
            if (res.length > 0) {
                const groupedResults: any = groupByExercise(res)
                setResults(groupedResults)
                
                // filters
                // exercise
                const keys = Object.keys(groupedResults)
                keys.splice(0, 0, 'All')
                setExerciseOptions(keys);

                // muscles
                const muscleGroupSet = new Set()
                res.map(item => muscleGroupSet.add(item.muscleGroup))
                const muscleGroupArray: any = Array.from(muscleGroupSet)
                muscleGroupArray.splice(0, 0, 'All')
                setMuscleOptions(muscleGroupArray)
            } else {
                setResults([])
                setExerciseOptions([]);
                setMuscleOptions([]);
            }
        } catch (e) {
            const error = `${t('errors.failedFetchResults')} ${e}`
            console.error(error);
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteRecord = async (item: Result) => {
        try {
            await deleteResult(item.id);
            Alert.alert(
                t('alerts.success'),
                t('alerts.recordDeleted'),
            );
            
            setResults((prevResults) => {
                const updatedResults: any = { ...prevResults };
                const filteredRecords = updatedResults[item.exercise].filter((record: Result) => record.id !== item.id);

                if (filteredRecords.length === 0) {
                    delete updatedResults[item.exercise];
                } else {
                    updatedResults[item.exercise] = filteredRecords;
                }

                return updatedResults;
            });
        } catch (e) {
            console.error(e);
            Alert.alert(
                t('alerts.error'),
                t('alerts.failedDeletingRecord'),
            );
        }
    };

    const handleDeleteRecord = (item: Result) => {
        Alert.alert(
            t('alerts.areYouSure'),
            t('alerts.sureToDeleteRecord'),
            [
                {text: t('alerts.yesProceed'), onPress: () => deleteRecord(item)},
                {text: t('alerts.noIchangedMyMind')},
            ]
        )
    }

    const handlePressedRecord = (item: Result) => {
        Alert.alert(
            t('alerts.chooseAction'), 
            '', 
            [
                {text: t('alerts.delete'), onPress: () => handleDeleteRecord(item)},
                {text: t('alerts.edit'), onPress: () => navigation.navigate('EditResult', { ...item })},
                {text: t('alerts.close')},
            ])
    }

    // TODO: i18n exercises
    const renderExercise = ({ item }: { item: any }, progress: any, key: number) => (
        <View key={key} >
            <View 
               style={[
                s.row,
                {
                    borderBottomColor: settingsStore.isDark ? COLORS.black : '#e9ecef',
                    borderLeftWidth: 5,
                    borderLeftColor:
                        progress === 'worse' ? '#F93827' :
                        progress === 'neutral' ? COLORS.orange :
                        progress === 'better' ? '#16C47F' :
                        settingsStore.isDark ? COLORS.darkGrey : COLORS.white,
                }
            ]}
            >
                <Text style={[s.cell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{getformattedDate(item.date)}</Text>
                <Text style={[s.cell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{MUSCLES.filter(i => i.title === item.muscleGroup)[0][settingsStore.language]}</Text>
                <Text style={[s.cell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{item.weight} {UNITS.filter(i => i.title === item.units)[0][settingsStore.language]}</Text>
                <Text style={[s.cell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{item.reps}</Text>
                <TouchableOpacity style={s.cell} onPress={() => handlePressedRecord(item)}>
                    <Ionicons style={s.cellAction} name="settings" color={COLORS.gray} size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTable = (data: any) => {
        let keys = Object.keys(data) || [];

        if (selectedMuscle !== 'All') {
            data = filterByMuscleGroup(data, selectedMuscle);
            keys = Object.keys(data);
        }

        if (selectedExercise !== 'All') {
            keys = keys.filter(item => item === selectedExercise);
        }

        if (keys.length === 0) {
            return (
                <View style={s.notFound}>
                    <Text style={s.text}>{t('history.noResults')}</Text>
                </View>
            )
        }

        return keys.map((exerciseName, i) => {
            return (
                <View key={i} style={[s.exerciseSection, { backgroundColor: settingsStore.isDark ? COLORS.darkGrey : COLORS.white }]}>
                    <Text style={[s.exerciseHeader, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#333'}]}>{toTitleCase(exerciseName)}</Text>
                    <View style={[s.row, s.headerRow, { backgroundColor: settingsStore.isDark ? COLORS.darkDarkGrey :'#f1f3f5', borderBottomColor: settingsStore.isDark ? COLORS.black : '#e9ecef'}]}>
                        <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.date')}</Text>
                        <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.muscle')}</Text>
                        <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.weight')}</Text>
                        <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.reps')}</Text>
                        <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.edit')}</Text>
                    </View>
                    {data[exerciseName].map((record: any, index: number) => {
                        let key = record.id
                        let progress = 'new'

                        if (selectedSorting.type === 'desc') {
                            const len = data[exerciseName].length
                            if (index + 1 < len) {
                                const previousSet = data[exerciseName][index + 1]
                                progress = getProgress(record, previousSet)
                            } 
                            return renderExercise({ item: record }, progress, key);
                        } else {
                            if (index > 0) {
                                const previousSet = data[exerciseName][index - 1]
                                progress = getProgress(record, previousSet)
                            }
                            return renderExercise({ item: record }, progress, key);
                        }
                    })}
                </View>
            )
        })
    };

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <ScrollView style={s.container}>
            {error && <View style={{ marginBottom: 15 }}><ErrorMessage message={error} setError={setError} /></View>}
            <View style={s.filterWrapper}>
                <Text style={[s.filterTitle, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('history.sorting')}:</Text>
                <SelectDropdown
                    data={[{title: t('history.byDateRecentFirst'), type: 'desc'}, {title: t('history.byDateOldestFirst'), type: 'asc'}]}
                    defaultValue={{title: t('history.byDateRecentFirst'), type: 'desc'}}
                    onSelect={(selectedItem, _) => setSelectedSorting(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={s.dropdownMenuStyle}
                    renderButton={(_) => (
                        <View style={s.dropdownButton}>
                            <Text style={[
                                s.selectedItem, 
                                { 
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.black,
                                    color: settingsStore.isDark ? COLORS.black : COLORS.white
                                }]}
                            >{selectedSorting.title}</Text>
                        </View>
                    )}
                    renderItem={(item, index, _) => { 
                        return (
                            <View key={index} style={[s.dropdownItemStyle, item.type === selectedSorting.type && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                                <Text style={s.dropdownItemTxtStyle}>{toTitleCase(item.title)}</Text>
                            </View>
                    )}}
                />
            </View>
            <View style={s.filterWrapper}>
                <Text style={[s.filterTitle, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('history.table.header.exercise')}:</Text>
                <SelectDropdown
                    data={exerciseOptions}
                    defaultValue={exerciseOptions.filter(item => item === 'All')[0]}
                    onSelect={(selectedItem, _) => setSelectedExercise(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={s.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={s.dropdownButton}>
                            {selectedExercise === 'All' 
                            ? <Text style={[
                                s.selectedItem, 
                                { 
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.black,
                                    color: settingsStore.isDark ? COLORS.black : COLORS.white
                                }]}>{'All'}</Text>
                            : <Text style={[
                                s.selectedItem, 
                                { 
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.black,
                                    color: settingsStore.isDark ? COLORS.black : COLORS.white
                                }]}>{toTitleCase(selectedItem)}</Text>
                            } 
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View key={index} style={[s.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                            <Text style={s.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={s.filterWrapper}>
                <Text style={[s.filterTitle, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('history.table.header.muscle')}:</Text>
                <SelectDropdown
                    data={muscleOptions}
                    defaultValue={muscleOptions.filter(item => item ==='All')[0]}
                    onSelect={(selectedItem, _) => setSelectedMuscle(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={s.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={s.dropdownButton}>
                            {selectedMuscle === 'All'
                            ? <Text style={[
                                s.selectedItem, 
                                { 
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.black,
                                    color: settingsStore.isDark ? COLORS.black : COLORS.white
                                }]}>{'All'}</Text>
                            : <Text style={[
                                s.selectedItem, 
                                { 
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.black,
                                    color: settingsStore.isDark ? COLORS.black : COLORS.white
                                }]}>{toTitleCase(selectedItem)}</Text>
                            } 
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View key={index} style={[s.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                            <Text style={s.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <TouchableOpacity style={[s.resetButton, isResetDisabled && s.resetButtonDisabled]} onPress={resetFilters} disabled={isResetDisabled}>
                <Text style={[s.resetButtonText, isResetDisabled && s.resetButtonTextDisabled]}>{t('history.resetFilter')}</Text>
            </TouchableOpacity>
            {renderTable(results)}
        </ScrollView>
    )
};

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
    resetButtonTextDisabled: {
        color: COLORS.black,
    },
    resetButtonDisabled: {
        backgroundColor: '#e0e0e0',
        opacity: 0.5
    },
    resetButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
      },
      resetButtonText: {
        color: '#ffffff',
        fontSize: FONT_SIZE.large,
        fontWeight: '600',
      },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: FONT_SIZE.normal,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownWrapper: {
        paddingHorizontal: 10
    },
    selectedItem: {
        backgroundColor: COLORS.black,
        color: COLORS.white,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    filterTitle: {
        fontWeight: '700',
        paddingHorizontal: 10,
        alignItems: 'center',
        width: 80,
    },
    filterWrapper: {
        flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    dropdownButton: {
        width: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        padding: 10,
        marginTop: 15,
    },
    exerciseSection: {
        marginBottom: 20,
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.blackTransparentBorder
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
        borderTopLeftRadius: 5
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: FONT_SIZE.normal,
    },
    cellAction: {
        textAlign: 'center',
    },
    headerCell: {
        fontWeight: 'bold',
    },
});
