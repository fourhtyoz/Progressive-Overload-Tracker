import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { toTitleCase, groupByExercise, filterByMuscleGroup } from '@/utils/helpFunctions';
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


type Props = DrawerScreenProps<DrawerParamList, 'History'>;


export default function HistoryScreen({ navigation } : Props) {
    const [results, setResults] = useState<GroupedResult[]>([]);
    const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
    const [selectedExercise, setSelectedExercise] = useState('All');
    const [muscleOptions, setMuscleOptions] = useState<string[]>([]);
    const [selectedMuscle, setSelectedMuscle] = useState('All');
    const [error, setError] = useState('');

    const { t } = useTranslation();

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
        }, [])
    )

    const getResults = async () => {
        try {
            const res = await fetchResults();
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
            const error = `Failed to fetch results: ${e}`
            console.error(error)
            setError(error)
        }
    }

    const deleteRecord = async (item: Result) => {
        try {
            await deleteResult(item.id);
            Alert.alert('Success', 'The record has been deleted successfully');
            
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
            Alert.alert('Error', `Whoops, something happened. The record has not been deleted: ${e}`);
        }
    };

    const handleDeleteRecord = (item: Result) => {
        Alert.alert(
            'Are you sure?',
            'Are you sure you want to delete the following record?',
            [
                {text: 'Yes, I\'m sure', onPress: () => deleteRecord(item)},
                {text: 'No, I\'ve changed my mind'},
            ]
        )
    }

    const handlePressedRecord = (item: Result) => {
        Alert.alert(
            'Actions', 
            'These are actions', 
            [
                {text: 'Delete', onPress: () => handleDeleteRecord(item)},
                {text: 'Edit', onPress: () => navigation.navigate('EditResult', { ...item })},
                {text: 'Close'},
            ])
    }

    // TODO: i18n exercises
    const renderExercise = ({ item }: { item: any }, progress: any, key: number) => (
        <View key={key} >
            <View 
                style={{
                    ...styles.row, 
                    ...(progress === 'worse' 
                        ? { borderLeftWidth: 5, borderLeftColor: '#F93827' } 
                        : progress === 'neutral' 
                        ? { borderLeftWidth: 5, borderLeftColor: COLORS.orange }
                        : progress === 'better' 
                        ? { borderLeftWidth: 5, borderLeftColor: '#16C47F' }
                        : { borderLeftWidth: 5, borderLeftColor: COLORS.white }
                    ) 
                }}
            >
                <Text style={styles.cell}>{item.date}</Text>
                <Text style={styles.cell}>{toTitleCase(item.muscleGroup)}</Text>
                <Text style={styles.cell}>{item.weight} {item.units}</Text>
                <Text style={styles.cell}>{item.reps}</Text>
                <TouchableOpacity style={styles.cell} onPress={() => handlePressedRecord(item)}>
                    <Ionicons style={styles.cellAction} name="settings" color={COLORS.gray} size={18} />
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
                <View style={styles.notFound}>
                    <Text style={styles.text}>No results</Text>
                </View>
            )
        }

        return keys.map((exerciseName, i) => {
            return (
                <View key={i} style={styles.exerciseSection}>
                    <Text style={styles.exerciseHeader}>{toTitleCase(exerciseName)}</Text>
                    <View style={[styles.row, styles.headerRow]}>
                        <Text style={[styles.cell, styles.headerCell]}>{t('history.table.header.date')}</Text>
                        <Text style={[styles.cell, styles.headerCell]}>{t('history.table.header.muscle')}</Text>
                        <Text style={[styles.cell, styles.headerCell]}>{t('history.table.header.weight')}</Text>
                        <Text style={[styles.cell, styles.headerCell]}>{t('history.table.header.reps')}</Text>
                        <Text style={[styles.cell, styles.headerCell]}>Edit</Text>
                    </View>
                    {data[exerciseName].map((record: any, index: number) => {
                        let progress = 'new'
                        let key = record.id
                        if (index > 0) {
                            const previousSet = data[exerciseName][index - 1]
                            const previousScore = previousSet.weight * previousSet.reps
                            const currentScore = record.weight * record.reps
                            if (previousScore > currentScore) {
                                progress = 'worse'
                            } else if (previousScore < currentScore) {
                                progress = 'better'
                            } else {
                                progress = 'neutral'
                            }
                        }
                        return renderExercise({ item: record }, progress, key);
                    })}
                </View>
            )
        })
    };

    return (
        <ScrollView style={
            [
                styles.container,
            ]
        }>
            {error && <View style={{ marginBottom: 15 }}><ErrorMessage message={error} setError={setError} /></View>}
            <View style={styles.filterWrapper}>
                <Text style={[styles.filterTitle, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>Exercise:</Text>
                <SelectDropdown
                    data={exerciseOptions}
                    defaultValue={exerciseOptions.filter(item => item === 'All')[0]}
                    onSelect={(selectedItem, _) => setSelectedExercise(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.dropdownButton}>
                            {selectedExercise === 'All' 
                            ? <Text style={styles.selectedItem}>{'All'}</Text>
                            : <Text style={styles.selectedItem}>{selectedItem}</Text>
                            } 
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View key={index} style={{...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight })}}>
                            <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.filterWrapper}>
                <Text style={[styles.filterTitle, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>Muscle:</Text>
                <SelectDropdown
                    data={muscleOptions}
                    defaultValue={muscleOptions.filter(item => item ==='All')[0]}
                    onSelect={(selectedItem, _) => setSelectedMuscle(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.dropdownButton}>
                            {selectedMuscle === 'All'
                            ? <Text style={styles.selectedItem}>{'All'}</Text>
                            : <Text style={styles.selectedItem}>{toTitleCase(selectedItem)}</Text>
                            } 
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View key={index} style={{...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight })}}>
                            <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <TouchableOpacity style={[styles.resetButton, isResetDisabled && styles.resetButtonDisabled]} onPress={resetFilters} disabled={isResetDisabled}>
                <Text style={[styles.resetButtonText, isResetDisabled && styles.resetButtonTextDisabled]}>Reset Filters</Text>
            </TouchableOpacity>
            {renderTable(results)}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
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
        color: '#9e9e9e',
    },
    resetButtonDisabled: {
        backgroundColor: '#e0e0e0',
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
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.blackTransparentBorder
    },
    exerciseHeader: {
        fontSize: FONT_SIZE.large,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerRow: {
        borderBottomWidth: 2,
        borderBottomColor: '#dee2e6',
        backgroundColor: '#f1f3f5',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: FONT_SIZE.normal,
        color: '#495057',
    },
    cellAction: {
        textAlign: 'center',
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#343a40',
    },
});
