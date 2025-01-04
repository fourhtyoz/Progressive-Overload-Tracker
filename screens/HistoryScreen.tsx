import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import { toTitleCase } from '@/utils/utils';


type Props = DrawerScreenProps<DrawerParamList, 'History'>;


export default function HistoryScreen({ navigation }: Props) {
    const [data, setData] = useState([])

    useEffect(() => {
        const getAllKeys = async () => {
            const allKeys = await AsyncStorage.getAllKeys()
            for (let key of allKeys) {
                const keyData = await AsyncStorage.getItem(key)
                if (!keyData) continue

                setData(prev => ({...prev, [key]: JSON.parse(keyData)}))
            }
            return data
        }

        getAllKeys()

    }, [])

    const renderExercise = ({ item }: { item: any }, exerciseName: string, progressed: any) => (
        <View style={{
            ...styles.row, 
            ...(progressed === 'worse' 
                ? { backgroundColor: '#F93827' } 
                : progressed === 'neutral' 
                    ? { backgroundColor: '#FFD65A' }
                    : progressed === 'better' 
                        ? { backgroundColor: '#16C47F' }
                        : { backgroundColor: '#FFF' }
            ) 
            }}>
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={styles.cell}>{exerciseName}</Text>
            <Text style={styles.cell}>{toTitleCase(item.muscleGroup)}</Text>
            <Text style={styles.cell}>{item.weightValue} {item.units}</Text>
            <Text style={styles.cell}>{item.repsValue}</Text>
        </View>
    );

    const renderTable = () => {
        return Object.keys(data).map((exerciseName) => (
            <View style={styles.exerciseSection}>
                <Text style={styles.exerciseHeader}>{exerciseName}</Text>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.cell, styles.headerCell]}>Date</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Exercise</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Muscle Group</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Weight</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Reps</Text>
                </View>
                {data[exerciseName].map((record, index) => {
                    let progressed = 'new'
                    if (index > 0) {
                        const previousSet = data[exerciseName][index - 1]
                        const previousScore = parseInt(previousSet.weightValue) * parseInt(previousSet.repsValue)
                        const currentScore = parseInt(record.weightValue) * parseInt(record.repsValue)
                        if (previousScore > currentScore) {
                            progressed = 'worse'
                        } else if (previousScore < currentScore) {
                            progressed = 'better'
                        } else {
                            progressed = 'neutral'
                        }
                    }
                    return renderExercise({ item: record }, exerciseName, progressed);
                })}

            </View>
        ));
    };

    return <ScrollView style={styles.container}>{renderTable()}</ScrollView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  exerciseSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
