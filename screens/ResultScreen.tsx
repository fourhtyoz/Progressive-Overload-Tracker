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
import Button from '@/components/buttons/Button';
import { useTranslation } from 'react-i18next';


type Props = DrawerScreenProps<DrawerParamList, 'Result'>;


export default function ResultScreen({ navigation }: Props) {
    const { t } = useTranslation();

    const [muscleGroup, setMuscleGroup] = useState('')
    const [exercise, setExercise] = useState('')
    const [repsValue, setRepsValue] = useState('')
    const [weightValue, setWeightValue] = useState('')
    const [units, setUnits] = useState(WEIGHTS.filter((item) => item.title.toLowerCase() === 'kg').title || 'kg')
    const [error, setError] = useState('')

    const muscleGroups = Array.from(new Set(EXERCISES.map(item => item.type)));

    const resetAllFields = () => {
        setRepsValue('')
        setWeightValue('')
        setExercise('')
        setMuscleGroup('')
        setError('')
    };

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
    };

    // TODO: date formats
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
            resetAllFields()
            Alert.alert(
                t('alerts.success'),
                t('alerts.newEntryAddedSuccess'),
            )
        } else {
            Alert.alert(
                t('alerts.error'),
                t('alerts.toAddFieldsRequired'),
            )
        }
    };

    const handleCreateExercise = () => {
        navigation.navigate('NewExercise')
    };

    const handleHistory = () => {
        navigation.navigate('History')
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>{t('result.options.muscle')}:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    onSelect={(selectedItem, index) => setMuscleGroup(selectedItem)}
                    renderButton={(selectedItem) => {
                        return (
                            <View style={styles.input}>
                                {!muscleGroup && <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseMuscle')}</Text>} 
                                {muscleGroup && <Text style={styles.exerciseText}>{toTitleCase(selectedItem)}</Text>}
                            </View>
                        );
                    }}
                    renderItem={(item, _, isSelected) => {
                        return (
                            <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>
            {/* TODO: i18n exercises */}
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>{t('result.options.exercise')}:</Text>
                <SelectDropdown
                    disabled={!muscleGroup}
                    data={EXERCISES.filter(item => item.type === muscleGroup)}
                    onSelect={(selectedItem, index) => setExercise(selectedItem.title)}
                    renderButton={(selectedItem) => {
                        return (
                            <View style={styles.input}>
                                {!exercise && <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseExercise')}</Text>} 
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
                <Text style={styles.inputLabel}>{t('result.options.reps')}:</Text>
                <TextInput 
                    style={styles.input} 
                    value={repsValue}
                    placeholder={t('result.options.howManyReps')}
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={setRepsValue}
                    keyboardType='numeric'
                />
            </View>
            {/* TODO: i18n weights */}
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>{t('result.options.weight')}:</Text>
                <TextInput 
                    style={styles.inputWithOption} 
                    value={weightValue}
                    placeholder={t('result.options.whatWeight')}
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
                    renderItem={(item, _, isSelected) => {
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
                    text={t('result.buttons.submit')}
                />
                <Button 
                    onPress={handleCreateExercise} 
                    text={t('result.buttons.create')}
                />
                <Button 
                    onPress={handleHistory} 
                    text={t('result.buttons.history')}
                />
            </View>
        </SafeAreaView>
    );
}