import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MUSCLES, UNITS } from '@/constants/settings';
import { getformattedDate, toTitleCase } from '@/utils/helpFunctions';
import SelectDropdown from 'react-native-select-dropdown';
import { globalStyles } from '@/styles/globalStyles';
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
    const [newGroup, setNewGroup] = useState<any>(null)
    const [newExercise, setNewExercise] = useState(null)
    const [newReps, setNewReps] = useState(null)
    const [newWeight, setNewWeight] = useState(null)
    const [newUnits, setUnits] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { t } = useTranslation();

    let muscleGroups = []
    for (let title of Array.from(new Set(exercises.map(item => item.type)))) {
        const translatedName = MUSCLES.filter(item => item.title === title)[0][settingsStore.language]
        const muscleObject = {title: title, translation: translatedName}
        muscleGroups.push(muscleObject)
    }

    const handleChangeReps = (value: any) => {
        value = Number(value)
        if (isNaN(value)) {
            setError(t('errors.repsMustBeNumber'))
            return
        } 
        if (value && value < 1) {
            setError(t('errors.repsMustBePositive'))
            return 
        }
        setNewReps(value)
    }

    const handleChangeWeight = (value: any) => {
        value = Number(value)
        if (isNaN(value)) {
            setError(t('errors.weightMustBeNumber'))
            return
        } 
        if (value && value < 1) {
            setError(t('errors.weightMustBePositive'))
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
                const muscle = newGroup?.title || newGroup
                await updateResult(
                    route.params.id, 
                    newExercise, 
                    dateString, 
                    muscle, 
                    newReps, 
                    newWeight, 
                    newUnits
                )

                Alert.alert(
                    t('alerts.success'),
                    t('alerts.newEntryAddedSuccess'),
                    [{text: t('alerts.goToHistory'), onPress: () => navigation.navigate('History')}]
                )
            } catch (e) {
                const error = `${t('errors.failedUpdateResult')} ${e}`
                console.error(error);
                setError(error)
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
                if (!Array.isArray(res)) throw new Error('fetchExercises returned no array')
                setExercises(res)
                setNewDate(route.params.date)
                setNewReps(route.params.reps)
                setNewWeight(route.params.weight)
                setUnits(route.params.units)
                setNewGroup(route.params.muscleGroup)
                setNewExercise(route.params.exercise)
            } catch (e) {
                const error = `${t('errors.failedFetchExercises')} ${e}`
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
        <SafeAreaView style={globalStyles.wrapper}>
            {error && <ErrorMessage message={error} setError={setError}/>}
            <View style={globalStyles.itemWrapper}>
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.date')}:</Text>
                <Text style={[globalStyles.date, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>
                    {getformattedDate(newDate)}
                </Text>
                <TouchableOpacity onPress={() => showMode('date')}>
                    <Ionicons name="calendar-outline" size={20} color={settingsStore.isDark ? COLORS.textDarkScreen : COLORS.gray}/>
                </TouchableOpacity>
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.muscle')}:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    defaultValue={muscleGroups.filter(item => item.title === newGroup)[0]}
                    onSelect={(selectedItem, _) => setNewGroup(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[globalStyles.input, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}>
                            {newGroup 
                            ? <Text style={[globalStyles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{selectedItem && selectedItem.translation || newGroup}</Text>
                            : <Text style={globalStyles.exerciseTextPlaceholder}>{t('result.options.chooseMuscle')}</Text>
                            }
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={[globalStyles.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                            <Text style={globalStyles.dropdownItemTxtStyle}>{toTitleCase(item.translation)}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.exercise')}:</Text>
                <SelectDropdown
                    data={exercises.filter(item => item.type === newGroup).length === 0 ? exercises.filter(item => item.type === newGroup.title) : exercises.filter(item => item.type === newGroup)}
                    defaultValue={route.params.exercise}
                    onSelect={(selectedItem, _) => setNewExercise(selectedItem.title)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[globalStyles.input, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}>
                            {newExercise 
                            ? <Text style={[globalStyles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{toTitleCase(newExercise)}</Text>
                            : <Text style={globalStyles.exerciseTextPlaceholder}>{t('result.options.chooseExercise')}</Text>
                            }
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => {
                        return (
                            <View style={[globalStyles.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                                <Text style={globalStyles.dropdownItemTxtStyle}>{index + 1}. {item.title}</Text>
                            </View>
                    )}}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.weight')}:</Text>
                <TextInput 
                    style={[globalStyles.inputWithOption, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}
                    value={`${newWeight}`}
                    placeholder={t('result.options.whatWeight')}
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={(value) => handleChangeWeight(value)}
                    keyboardType='numeric' 
                />
                <SelectDropdown
                    data={UNITS}
                    defaultValue={UNITS.filter(item => item.title === settingsStore.units)[0]}
                    onSelect={(selectedItem) => setUnits(selectedItem[settingsStore.language])}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[globalStyles.dropdownButtonStyle, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray}]}>
                            <Text style={globalStyles.dropdownButtonTxtStyle}>{(selectedItem && selectedItem[settingsStore.language]) || newUnits}</Text>
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={[globalStyles.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                            <Text style={globalStyles.dropdownItemTxtStyle}>{item[settingsStore.language]}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.reps')}:</Text>
                <TextInput 
                    style={[globalStyles.input, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}
                    value={`${newReps}`}
                    placeholder={t('result.options.howManyReps')}
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={(value) => handleChangeReps(value)}
                    keyboardType='numeric'
                />
            </View>
            <View style={globalStyles.buttonWrapper}>
                <Button 
                    onPress={handleSubmitEntry} 
                    text={t('result.buttons.updateResult')}
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder} 
                />
            </View>
        </SafeAreaView>
    );
});

export default EditResultScreen;