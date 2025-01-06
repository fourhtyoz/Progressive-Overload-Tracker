import React, { useState } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WEIGHTS } from '@/constants/weights';
import { EXERCISES } from '@/constants/exercises';
import { toTitleCase } from '@/utils/utils';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/styles/styles';
import Button from '@/components/Button';


type Props = DrawerScreenProps<DrawerParamList, 'Result'>;


export default function ResultScreen({ navigation }: Props) {
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

    const storeData = async (key: string, value: any) => {
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
                date: new Date().toLocaleDateString('ru-Ru', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                })
            }
            storeData(exercise, data)
            Alert.alert(
                'Success', 
                'A new entry has been added to your history', 
                [{text: 'OK'}]
            )
            resetAllFields()
        } else {
            Alert.alert(
                'Error', 
                'To add a new entry you need to fill out all fields', 
                [{text: 'OK'}]
            )
        }
    }

    const handleCreateExercise = () => {
        navigation.navigate('New Exercise')
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
                <Button 
                    onPress={handleSubmitEntry} 
                    bgColor={'#000'} 
                    pressedBgColor={'#FFF'} 
                    borderColor={'#FFF'} 
                    pressedBorderColor={'rgba(0, 0, 0, .1)'} 
                    textColor={'#FFF'} 
                    pressedTextColor={'#000'} 
                    text={'Submit'}
                />
                <Button 
                    onPress={handleCreateExercise} 
                    bgColor={'#000'} 
                    pressedBgColor={'#FFF'} 
                    borderColor={'#FFF'} 
                    pressedBorderColor={'rgba(0, 0, 0, .1)'} 
                    textColor={'#FFF'} 
                    pressedTextColor={'#000'} 
                    text={'Create a new exercise'}
                />
                <Button 
                    onPress={handleHistory} 
                    bgColor={'#000'} 
                    pressedBgColor={'#FFF'} 
                    borderColor={'#FFF'} 
                    pressedBorderColor={'rgba(0, 0, 0, .1)'} 
                    textColor={'#FFF'} 
                    pressedTextColor={'#000'} 
                    text={'History'}
                />
            </View>
        </SafeAreaView>
    );
}