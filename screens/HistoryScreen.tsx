import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import { toTitleCase, groupByExercise } from '@/utils/helpFunctions';
import SelectDropdown from 'react-native-select-dropdown';
import { COLORS } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { fetchResults } from '@/services/db';
import { Result, GroupedResult } from '@/utils/types';
import ErrorMessage from '@/components/ErrorMessage';


type Props = DrawerScreenProps<DrawerParamList, 'History'>;


export default function HistoryScreen({ navigation }: Props) {
    const [results, setResults] = useState<Result[]>([])
    const [groupedResults, setGroupedResults] = useState<any>([])
    const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [error, setError] = useState('efefef');

    const { t } = useTranslation();

    useEffect(() => {
        const getResults = async () => {
            try {
                const res = await fetchResults();
                if (!Array.isArray(res)) throw new Error('fetchResults returned no array')
                setResults(res)
            } catch (e) {
                const error = `Failed to fetch results: ${e}`
                console.error(error)
                setError(error)
            }
        }

        getResults()
    }, [navigation])

    useEffect(() => {
        if (Array.isArray(results) && results.length > 0) {
            const transformedResults = groupByExercise(results)
            setGroupedResults(transformedResults)

            // filter
            const keys = Object.keys(transformedResults)
            keys.splice(0, 0, 'All')
            setExerciseOptions(keys);
        }

    }, [results])

    // TODO: i18n exercises
    const renderExercise = ({ item }: { item: any }, progress: any, key: number) => (
        <View 
            key={key} 
            style={{
                ...styles.row, 
                ...(progress === 'worse' 
                    ? { borderLeftWidth: 5, borderLeftColor: '#F93827' } 
                    : progress === 'neutral' 
                        ? { borderLeftWidth: 5, borderLeftColor: COLORS.orange }
                        : progress === 'better' 
                            ? { borderLeftWidth: 5, borderLeftColor: '#16C47F' }
                            : { borderLeftWidth: 5, borderLeftColor: '#FFF' }
                ) 
            }}
        >
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={styles.cell}>{toTitleCase(item.muscleGroup)}</Text>
            <Text style={styles.cell}>{item.weight} {item.units}</Text>
            <Text style={styles.cell}>{item.reps}</Text>
        </View>
    );

    const renderTable = (data: GroupedResult) => {
        let keys = Object.keys(data) || []
        
        if (selectedExercise && selectedExercise !== 'All') {
            keys = keys.filter(item => item === selectedExercise)
        }

        return keys.map((exerciseName, i) => {
            return (
                <View key={i} style={styles.exerciseSection}>
                    <Text style={styles.exerciseHeader}>{exerciseName}</Text>
                    <View style={[styles.row, styles.headerRow]}>
                        <Text style={[styles.cell, styles.headerCell]}>{t('history.table.header.date')}</Text>
                        <Text style={[styles.cell, styles.headerCell]}>{t('history.table.header.muscle')}</Text>
                        <Text style={[styles.cell, styles.headerCell]}>{t('history.table.header.weight')}</Text>
                        <Text style={[styles.cell, styles.headerCell]}>{t('history.table.header.reps')}</Text>
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
        <ScrollView style={styles.container}>
            {error && <View style={{ marginBottom: 15 }}><ErrorMessage message={error} /></View>}
            <Text>Exercise:</Text>
              <SelectDropdown
                    data={exerciseOptions}
                    onSelect={(selectedItem, index) => setSelectedExercise(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    renderButton={(selectedItem) => (
                        <View>
                            {!selectedExercise && <Text>{'All'}</Text>} 
                            <Text>{selectedItem}</Text>
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View key={index}>
                            <Text>{item}</Text>
                        </View>
                    )}
                />
            {renderTable(groupedResults)}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 15,
        backgroundColor: '#f8f9fa',
    },
    exerciseSection: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
    },
    exerciseHeader: {
        fontSize: 18,
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
        fontSize: 14,
        color: '#495057',
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#343a40',
    },
});
