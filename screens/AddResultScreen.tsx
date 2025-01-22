import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UNITS } from '@/constants/settings';
import { toTitleCase } from '@/utils/helpFunctions';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { styles } from '@/styles/styles';
import Button from '@/components/buttons/Button';
import { useTranslation } from 'react-i18next';
import { fetchExercises, addResult } from '@/services/db';
import { settingsStore } from '@/store/store';
import { observer } from 'mobx-react-lite';
import { Exercise } from '@/utils/types';
import ErrorMessage from '@/components/ErrorMessage';
import { COLORS } from '@/styles/colors';


type Props = DrawerScreenProps<DrawerParamList, 'AddResult'>;


const AddResultScreen = observer(({ navigation }: Props) => {
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [muscleGroup, setMuscleGroup] = useState('')
    const [exercise, setExercise] = useState('')
    const [repsValue, setRepsValue] = useState('')
    const [weightValue, setWeightValue] = useState('')
    const [units, setUnits] = useState(settingsStore.units)
    const [error, setError] = useState('')

    const { t } = useTranslation();

    const muscleGroups = Array.from(new Set(exercises.map(item => item.type)));

    const resetAllFields = () => {
        setRepsValue('')
        setWeightValue('')
        setExercise('')
        setMuscleGroup('')
        setError('')
    };

    const handleChangeReps = (value: any) => {
        value = Number(value)
        if (isNaN(value)) {
            setError(`Reps must be a number`)
            return
        } 
        if (value && value < 1) {
            setError(`Reps must be a positive number`)
            return 
        } 
        setRepsValue(value)
    }

    const handleChangeWeight = (value: any) => {
        value = Number(value)
        if (isNaN(value)) {
            setError(`Weight must be a number`)
            return
        } 
        if (value && value < 1) {
            setError(`Weight must be a positive number`)
            return 
        } 
        setWeightValue(value)
    }

    // TODO: date formats
    const handleSubmitEntry = async () => {
        if (muscleGroup && exercise && repsValue && weightValue && units) {
            const date = new Date().toLocaleDateString('ru-Ru', { year: '2-digit', month: '2-digit', day: '2-digit'})
            try {
                addResult(
                    exercise,
                    date,
                    muscleGroup, 
                    repsValue, 
                    weightValue, 
                    units
                )
                resetAllFields()
                Alert.alert(
                    t('alerts.success'),
                    t('alerts.newEntryAddedSuccess'),
                )
            } catch (e) {
                setError(String(e))
                console.error(e)
            }
        } else {
            Alert.alert(
                t('alerts.error'),
                t('alerts.toAddFieldsRequired'),
            )
        }
    };

    const handleCreateExercise = () => {
        navigation.navigate('AddExercise')
    };

    const handleHistory = () => {
        navigation.navigate('History')
    };

    useEffect(() => {
        const getExercises = async () => {
            try {
                const res = await fetchExercises();
                if (!Array.isArray(res)) throw new Error('fetchExercises return no array')
                setExercises(res)
                if (res?.length === 0) {
                    Alert.alert(
                        'Нет упражнений',
                        'У вас еще не заведены упражнения',
                        [{text: 'Завести упражнение', onPress: () => navigation.navigate('AddExercise')}]
                    )
                }
            } catch (e) {
                const error = `Failed to fetch exercises: ${e}`
                console.error(error);
                setError(error)
            }
        };

        getExercises()
    }, [navigation])

    return (
        <SafeAreaView style={styles.wrapper}>
            {error && <ErrorMessage message={error} setError={setError}/>}
            <View style={styles.itemWrapper}>
                <Text style={[styles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.muscle')}:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    onSelect={(selectedItem, _) => setMuscleGroup(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[styles.input, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}>
                            {muscleGroup 
                            ? <Text style={[styles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{toTitleCase(selectedItem)}</Text>
                            : <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseMuscle')}</Text>
                            }
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight })}}>
                            <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={
                    [
                        styles.inputLabel, 
                        { 
                            color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black,
                            opacity: !muscleGroup ? 0.3 : 1,
                        }
                    ]
                }>{
                    t('result.options.exercise')}:
                </Text>
                <SelectDropdown
                    disabled={!muscleGroup}
                    data={exercises.filter(item => item.type === muscleGroup)}
                    onSelect={(selectedItem, _) => setExercise(selectedItem.title)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[
                            styles.input, 
                            { 
                                borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray,
                                opacity: !muscleGroup ? 0.3 : 1,
                            }
                            ]
                        }>
                            {exercise 
                            ? <Text style={[styles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{(selectedItem && selectedItem.title)}</Text>
                            : <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseExercise')}</Text>
                            }
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight })}}>
                            <Text style={styles.dropdownItemTxtStyle}>{index + 1}. {item.title}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={[styles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.reps')}:</Text>
                <TextInput 
                    style={[styles.input, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]} 
                    value={repsValue}
                    placeholder={t('result.options.howManyReps')}
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={(value) => handleChangeReps(value)}
                    keyboardType='numeric'
                />
            </View>
            {/* TODO: i18n weights */}
            <View style={styles.itemWrapper}>
                <Text style={[styles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.weight')}:</Text>
                <TextInput 
                    style={[styles.inputWithOption, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]} 
                    value={weightValue} // 
                    placeholder={t('result.options.whatWeight')}
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={(value) => handleChangeWeight(value)}
                    keyboardType='numeric' 
                />
                <SelectDropdown
                    data={UNITS}
                    defaultValue={UNITS.filter(item => item.title === settingsStore.units)[0]}
                    onSelect={(selectedItem) => setUnits(selectedItem.title)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[styles.dropdownButtonStyle, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray}]}>
                            <Text style={styles.dropdownButtonTxtStyle}>{(selectedItem && selectedItem.title) || settingsStore.units}</Text>
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight })}}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    )}
                />
            </View>
            
            <View style={styles.buttonWrapper}>
                <Button 
                    onPress={handleSubmitEntry} 
                    text={t('result.buttons.submit')}
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder} 
                />
                <Button 
                    onPress={handleCreateExercise} 
                    text={t('result.buttons.create')}
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder} 
                />
                <Button 
                    onPress={handleHistory} 
                    text={t('result.buttons.history')}
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder} 
                />
            </View>
        </SafeAreaView>
    );
});

export default AddResultScreen;