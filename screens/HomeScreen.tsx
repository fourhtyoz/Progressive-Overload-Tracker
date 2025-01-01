import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WEIGHTS } from '@/constants/weights';
import { EXERCISES } from '@/constants/exercises';
import { toTitleCase } from '@/utils/utils';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Props = DrawerScreenProps<DrawerParamList, 'Home'>;


export default function HomeScreen({ navigation }: Props) {
    // not a great idea to have all styles in here. Duplicates are real
    const styles = StyleSheet.create({
        input: {
            flex: 1,
            height: 40,
            borderWidth: 1,
            padding: 10,
            borderColor: 'lightgray',
            borderRadius: 5,
            color: '#000',
        },
        inputWithOption: {
            flex: 1,
            height: 40,
            borderWidth: 1,
            padding: 10,
            borderColor: 'lightgray',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            color: '#000',
        },
        dropdownButtonStyle: {
            width: 45,
            height: 40,
            backgroundColor: '#000',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        dropdownButtonTxtStyle: {
            color: '#FFF',
        },
        dropdownButtonArrowStyle: {
            fontSize: 28,
        },
        dropdownMenuStyle: {
            backgroundColor: '#E9ECEF',
            borderRadius: 8,
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
            fontSize: 18,
            fontWeight: '500',
            color: '#151E26',
        },
        dropdownItemIconStyle: {
            fontSize: 28,
            marginRight: 8,
        },
        itemWrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15
        },
        inputLabel: {
            fontWeight: 'bold',
            width: 70
        },
        wrapper: {
            paddingHorizontal: 20,

        },
        exerciseText: {
            color: '#000'
        },
        exerciseTextPlaceholder: {
            color: '#a9a9a9'
        },
        submitButton: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
            borderRadius: 5,
            backgroundColor: 'black',
            },
        submitButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: 'white',
        },
        buttonWrapper: {
            marginVertical: 15
        }
    });

    const [muscleGroup, setMuscleGroup] = useState('')
    const [exercise, setExercise] = useState('')
    const [repsValue, setRepsValue] = useState('')
    const [weightValue, setWeightValue] = useState('')
    const [units, setUnits] = useState(WEIGHTS.filter((item) => item.title.toLowerCase() === 'kg').title || 'kg')
    const [error, setError] = useState('')

    const muscleGroups = Array.from(new Set(EXERCISES.map(item => item.type)))

    const resetAllFields = () => {
        setRepsValue('')
        setWeightValue('')
        setExercise('')
        setMuscleGroup('')
        setError('')
    }

    const storeData = async (key: string, value: string) => {
        try {
            const prevValue = await AsyncStorage.getItem(key)
            if (!prevValue) {
                await AsyncStorage.setItem(key, JSON.stringify([value]))
            } else {
                const newValue = JSON.parse(prevValue)
                newValue.push(value)
                await AsyncStorage.setItem(key, JSON.stringify(newValue))
            }
        } catch (e) {
            console.log(e)
            console.error(e)
        }
    }

    const handleSubmitEntry = () => {
        if (muscleGroup && exercise && repsValue && weightValue && units) {
            const data = {
                muscleGroup: muscleGroup,
                exercise: exercise,
                repsValue: repsValue,
                weightValue: weightValue,
                units: units,
                date: new Date().toLocaleDateString()
            }
            storeData(exercise, data)
            Alert.alert(
                'Success', 
                'A new entry has been added to your history', 
                [
                    {text: 'OK'}
                ]
            )
            resetAllFields()
        } else {
            Alert.alert(
                'Error', 
                'To add a new entry you need to fill out all fields', 
                [
                    {text: 'OK'}
                ]
            )
        }
    }

    const handleCreateExercise = () => {
        navigation.navigate('NewExercise')
    }

    const handleHistory = () => {
        navigation.navigate('History')
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Type:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    onSelect={(selectedItem, index) => setMuscleGroup(selectedItem)}
                    renderButton={(selectedItem) => {
                        return (
                            <View style={styles.input}>
                                {!muscleGroup && <Text style={styles.exerciseTextPlaceholder}>{'Choose a muscle group'}</Text>} 
                                {muscleGroup && <Text style={styles.exerciseText}>{toTitleCase(selectedItem)}</Text>}
                            </View>
                    );
                    }}
                    renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Exercise:</Text>
                <SelectDropdown
                    disabled={!muscleGroup}
                    data={EXERCISES.filter(item => item.type === muscleGroup)}
                    onSelect={(selectedItem, index) => setExercise(selectedItem.title)}
                    renderButton={(selectedItem) => {
                        return (
                            <View style={styles.input}>
                                {!exercise && <Text style={styles.exerciseTextPlaceholder}>{'Choose an exercise'}</Text>} 
                                {exercise && <Text style={styles.exerciseText}>{(selectedItem && selectedItem.title)}</Text>}
                            </View>
                        );
                    }}
                    renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={styles.dropdownItemTxtStyle}>{index + 1}. {item.title}</Text>
                        </View>
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Reps:</Text>
                <TextInput 
                    style={styles.input} 
                    value={repsValue}
                    placeholder='How many reps?'
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={setRepsValue}
                    keyboardType='numeric'
                    />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Weight:</Text>
                <TextInput 
                    style={styles.inputWithOption} 
                    value={weightValue}
                    placeholder="What weight?"
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={setWeightValue}
                    keyboardType='numeric' 
                />
                <SelectDropdown
                    data={WEIGHTS}
                    onSelect={(selectedItem) => setUnits(selectedItem.title)}
                    renderButton={(selectedItem) => {
                    return (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>{(selectedItem && selectedItem.title) || units}</Text>
                        </View>
                    );
                    }}
                    renderItem={(item, isSelected) => {
                        return (
                            <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                            </View>
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>
            
            <View style={styles.buttonWrapper}>
                <Pressable style={styles.submitButton} onPress={handleSubmitEntry}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </Pressable>
            </View>
            
            <View>
                <Pressable style={styles.submitButton} onPress={handleCreateExercise}>
                    <Text style={styles.submitButtonText}>Create a new exercise</Text>
                </Pressable>
            </View>

            <View style={styles.buttonWrapper}>
                <Pressable style={styles.submitButton} onPress={handleHistory}>
                    <Text style={styles.submitButtonText}>History</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}