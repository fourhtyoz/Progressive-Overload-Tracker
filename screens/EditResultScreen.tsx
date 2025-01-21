import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UNITS } from '@/constants/settings';
import { toTitleCase } from '@/utils/helpFunctions';
import SelectDropdown from 'react-native-select-dropdown';
import { styles } from '@/styles/styles';
import Button from '@/components/buttons/Button';
import { useTranslation } from 'react-i18next';
import { fetchExercises, updateResult } from '@/services/db';
import { observer } from 'mobx-react-lite';
import { Exercise } from '@/utils/types';
import ErrorMessage from '@/components/ErrorMessage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';


const EditResultScreen = observer(({ navigation, route }: any) => {
    const { id, date, exercise, muscleGroup, reps, units, weight } = route.params

    // date parsing
    const [day, month, year] = date.split('.').map(Number);
    const dateObj = new Date(2000 + year, month - 1, day);

    const [exercises, setExercises] = useState<Exercise[]>([])
    const [newDate, setNewDate] = useState(dateObj)
    const [newGroup, setNewGroup] = useState(muscleGroup)
    const [newExercise, setNewExercise] = useState(exercise)
    const [newReps, setNewReps] = useState(reps)
    const [newWeight, setNewWeight] = useState(weight)
    const [newUnits, setUnits] = useState(units)
    const [error, setError] = useState('')

    const { t } = useTranslation();

    const muscleGroups = Array.from(new Set(exercises.map(item => item.type)));

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
        setNewReps(value)
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
        setNewWeight(value)
    }

    // TODO: date formats
    const handleSubmitEntry = async () => {
        if (newDate && newGroup && newExercise && newReps && newWeight && newUnits) {
            const d = newDate.toLocaleDateString('ru-Ru', { year: '2-digit', month: '2-digit', day: '2-digit'})
            try {
                await updateResult(
                    id, 
                    newExercise, 
                    d, 
                    newGroup, 
                    newReps, 
                    newWeight, 
                    newUnits
                )

                Alert.alert(
                    t('alerts.success'),
                    t('alerts.newEntryAddedSuccess'),
                    [{text: 'Go to history', onPress: () => navigation.navigate('History')}]
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

    const onChange = (_: any, selectedDate: any) => {
        const currentDate = selectedDate
        setNewDate(currentDate);
      };

    const showMode = (currentMode: any) => {
        DateTimePickerAndroid.open({
            value: newDate,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            {error && <ErrorMessage message={error} setError={setError}/>}
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Date:</Text>
                <Text style={styles.date}>
                    {newDate.toLocaleDateString(
                        'ru-Ru', 
                        {  year: '2-digit', month: '2-digit', day: '2-digit' }
                    )}
                </Text>
                <TouchableOpacity onPress={() => showMode('date')}>
                    <Ionicons name="calendar-outline" size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>{t('result.options.muscle')}:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    onSelect={(selectedItem, index) => setNewGroup(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.input}>
                            {!newGroup && <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseMuscle')}</Text>} 
                            {newGroup && <Text style={styles.exerciseText}>{toTitleCase(newGroup)}</Text>}
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            {/* TODO: i18n exercises */}
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>{t('result.options.exercise')}:</Text>
                <SelectDropdown
                    disabled={!muscleGroup}
                    data={exercises.filter(item => item.type === newGroup)}
                    onSelect={(selectedItem, index) => setNewExercise(selectedItem.title)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.input}>
                            {!newExercise && <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseExercise')}</Text>} 
                            {newExercise && <Text style={styles.exerciseText}>{toTitleCase(newExercise)}</Text>}
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={styles.dropdownItemTxtStyle}>{index + 1}. {item.title}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>{t('result.options.reps')}:</Text>
                <TextInput 
                    style={styles.input} 
                    value={newReps}
                    placeholder={t('result.options.howManyReps')}
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={(value) => handleChangeReps(value)}
                    keyboardType='numeric'
                />
            </View>
            {/* TODO: i18n weights */}
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>{t('result.options.weight')}:</Text>
                <TextInput 
                    style={styles.inputWithOption} 
                    value={newWeight}
                    placeholder={t('result.options.whatWeight')}
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={(value) => handleChangeWeight(value)}
                    keyboardType='numeric' 
                />
                <SelectDropdown
                    data={UNITS}
                    onSelect={(selectedItem) => setUnits(selectedItem.title)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>{(selectedItem && selectedItem.title) || newUnits}</Text>
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    )}
                />
            </View>
            
            <View style={styles.buttonWrapper}>
                <Button onPress={handleSubmitEntry} text='Update record' />
            </View>
        </SafeAreaView>
    );
});

export default EditResultScreen;