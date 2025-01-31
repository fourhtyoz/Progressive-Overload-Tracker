import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MUSCLES, UNITS } from '@/constants/settings';
import { getformattedDate, toTitleCase } from '@/utils/helpFunctions';
import SelectDropdown from 'react-native-select-dropdown';
import { globalStyles } from '@/styles/globalStyles';
import Button from '@/components/buttons/Button';
import { useTranslation } from 'react-i18next';
import { fetchExercises, fetchResultById, updateResult } from '@/services/db';
import { observer } from 'mobx-react-lite';
import { TExercise } from '@/utils/types';
import ErrorMessage from '@/components/ErrorMessage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { settingsStore } from '@/store/store';
import { COLORS } from '@/styles/colors';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';


const EditResultScreen = observer(({ navigation, route }: any) => {
    const [exercises, setExercises] = useState<TExercise[]>([])
    const [newDate, setNewDate] = useState(new Date())
    const [newGroup, setNewGroup] = useState<any>(null)
    const [newExercise, setNewExercise] = useState<any>(null)
    const [newReps, setNewReps] = useState('')
    const [newWeight, setNewWeight] = useState<any>('')
    const [newUnits, setNewUnits] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { t } = useTranslation();

    let muscleGroups = []
    for (let title of Array.from(new Set(exercises.map(item => item.type)))) {
        const translatedName = MUSCLES.find(item => item.title === title)?.[settingsStore.language]
        const muscleObject = {title: title, translation: translatedName}
        muscleGroups.push(muscleObject)
    }

    const handleChangeReps = (value: any) => {
        if (!value) {
            setNewReps('')
            return
        }
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
        if (!value) {
            setNewWeight('')
            return
        }
        value = Number(value)
        if (isNaN(value)) {
            setError(t('errors.weightMustBeNumber'))
            return
        } 
        setNewWeight(value)
    }

    console.log('newGroup', newGroup)

    const handleSubmitEntry = async () => {
        if (newDate && newGroup && newExercise && newReps && !isNaN(newWeight) && newUnits) {
            try {
                let dateString: string | Date = newDate
                if (newDate instanceof Date) {
                    dateString = newDate.toISOString()
                }
                const muscle = newGroup?.title || newGroup
                await updateResult(
                    route.params.resultId, 
                    newExercise.title,
                    newExercise.id,
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
        const getResult = async (resultId: number) => {
            setIsLoading(true)
            try {
                const res = await fetchResultById(resultId)

                setNewDate(res.date)
                setNewExercise({id: res.exercise_id, title: res.exercise})
                setNewGroup(res.muscleGroup)
                setNewReps(res.reps)
                setNewWeight(res.weight)
                setNewUnits(res.units)

            } catch (e) {
                const error = `getResult ${e}`
                console.error(error);
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        const getExercises = async () => {
            setIsLoading(true)
            try {
                const res = await fetchExercises();
                setExercises(res)
            } catch (e) {
                const error = `${t('errors.failedFetchExercises')} ${e}`
                console.error(error);
                setError(error)
            } finally {
                setIsLoading(false)
            }
        };

        getResult(route.params.resultId)
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
                    onSelect={(selectedItem, _) => {
                        setNewGroup(selectedItem)
                        setNewExercise(null)
                    }}
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
                    defaultValue={newExercise}
                    onSelect={selectedItem => {
                        setNewExercise(selectedItem)
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[globalStyles.input, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}>
                            {newExercise 
                            ? <Text style={[globalStyles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{toTitleCase(newExercise.title)}</Text>
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
                    testID='input-weight' 
                    style={[globalStyles.inputWithOption, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}
                    value={`${newWeight}`}
                    placeholder={t('result.options.whatWeight')}
                    placeholderTextColor={COLORS.placeholderTextLight}
                    onChangeText={(value) => handleChangeWeight(value)}
                    keyboardType='numeric' 
                />
                <SelectDropdown
                    data={UNITS}
                    defaultValue={UNITS.filter(item => item.title === settingsStore.units)[0]}
                    onSelect={(selectedItem) => setNewUnits(selectedItem[settingsStore.language])}
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
                    testID='input-reps' 
                    style={[globalStyles.input, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]}
                    value={`${newReps}`}
                    placeholder={t('result.options.howManyReps')}
                    placeholderTextColor={COLORS.placeholderTextLight}
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