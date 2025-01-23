import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UNITS } from '@/constants/settings';
import { getformattedDate, toTitleCase } from '@/utils/helpFunctions';
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
import { settingsStore } from '@/store/store';
import { COLORS } from '@/styles/colors';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';


const EditResultScreen = observer(({ navigation, route }: any) => {

    const [exercises, setExercises] = useState<Exercise[]>([])
    const [newDate, setNewDate] = useState(new Date())
    const [newGroup, setNewGroup] = useState(null)
    const [newExercise, setNewExercise] = useState(null)
    const [newReps, setNewReps] = useState(null)
    const [newWeight, setNewWeight] = useState(null)
    const [newUnits, setUnits] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

    const handleSubmitEntry = async () => {
        if (newDate && newGroup && newExercise && newReps && newWeight && newUnits) {
            try {
                let dateString: string | Date = newDate
                if (newDate instanceof Date) {
                    dateString = newDate.toISOString()
                }
                await updateResult(
                    route.params.id, 
                    newExercise, 
                    dateString, 
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
            Toast.show({
                type: 'error',
                text1: t('toasts.error'),
                text2: t('alerts.toAddFieldsRequired'),
            });
        }
    };

    useEffect(() => {
        const getExercises = async () => {
            setIsLoading(true)
            try {
                const res = await fetchExercises();
                if (!Array.isArray(res)) throw new Error('fetchExercises return no array')
                setExercises(res)
                setNewDate(route.params.date)
                setNewReps(route.params.reps)
                setNewWeight(route.params.weight)
                setUnits(route.params.units)
                setNewGroup(route.params.muscleGroup)
                setNewExercise(route.params.exercise)
            } catch (e) {
                const error = `Failed to fetch exercises: ${e}`
                console.error(error);
                setError(error)
            } finally {
                setIsLoading(false)
            }
        };

        getExercises()
    }, [route])

    const onChange = (_: any, selectedDate: any) => {
        const currentDate = selectedDate
        setNewDate(currentDate);
      };

    const showMode = (currentMode: any) => {
        DateTimePickerAndroid.open({
            value: new Date(newDate),
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            {error && <ErrorMessage message={error} setError={setError}/>}
            <View style={styles.itemWrapper}>
                <Text style={[styles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>Date:</Text>
                <Text style={[styles.date, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>
                    {getformattedDate(newDate)}
                </Text>
                <TouchableOpacity onPress={() => showMode('date')}>
                    <Ionicons name="calendar-outline" size={20} color={settingsStore.isDark ? COLORS.textDarkScreen : COLORS.gray}/>
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrapper}>
                <Text style={[styles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.muscle')}:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    defaultValue={muscleGroups.filter(item => item === newGroup)[0]}
                    onSelect={(selectedItem, _) => setNewGroup(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(_) => (
                        <View style={[styles.input, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}>
                            {newGroup 
                            ? <Text style={[styles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{toTitleCase(newGroup)}</Text>
                            : <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseMuscle')}</Text>
                            }
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={[styles.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                            <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            {/* TODO: i18n exercises */}
            <View style={styles.itemWrapper}>
                <Text style={[styles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.exercise')}:</Text>
                <SelectDropdown
                    data={exercises.filter(item => item.type === newGroup)}
                    defaultValue={route.params.exercise}
                    onSelect={(selectedItem, _) => setNewExercise(selectedItem.title)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[styles.input, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}>
                            {newExercise 
                            ? <Text style={[styles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{toTitleCase(newExercise)}</Text>
                            : <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseExercise')}</Text>
                            }
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => {
                        return (
                            <View style={[styles.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                                <Text style={styles.dropdownItemTxtStyle}>{index + 1}. {item.title}</Text>
                            </View>
                    )}}
                />
            </View>
            {/* TODO: i18n weights */}
            <View style={styles.itemWrapper}>
                <Text style={[styles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.weight')}:</Text>
                <TextInput 
                    style={[styles.inputWithOption, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}
                    value={`${newWeight}`}
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
                            <Text style={styles.dropdownButtonTxtStyle}>{(selectedItem && selectedItem.title) || newUnits}</Text>
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={[styles.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={[styles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.reps')}:</Text>
                <TextInput 
                    style={[styles.input, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}
                    value={`${newReps}`}
                    placeholder={t('result.options.howManyReps')}
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={(value) => handleChangeReps(value)}
                    keyboardType='numeric'
                />
            </View>
            
            <View style={styles.buttonWrapper}>
                <Button 
                    onPress={handleSubmitEntry} 
                    text='Update record' 
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder} 
                />
            </View>
        </SafeAreaView>
    );
});

export default EditResultScreen;