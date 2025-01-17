import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UNITS } from '@/constants/settings';
import { toTitleCase } from '@/utils/utils';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { styles } from '@/styles/styles';
import Button from '@/components/buttons/Button';
import { useTranslation } from 'react-i18next';
import { fetchExercises, addResult } from '@/services/db';
import { settingsStore } from '@/store/store';
import { observer } from 'mobx-react-lite';


type Props = DrawerScreenProps<DrawerParamList, 'AddResult'>;

type Exercise = {
    title: string,
    type: string
}


const AddResultScreen = observer(({ navigation }: Props) => {
    const { t } = useTranslation();

    const [exercises, setExercises] = useState<Exercise[]>([])
    const [muscleGroup, setMuscleGroup] = useState('')
    const [exercise, setExercise] = useState('')
    const [repsValue, setRepsValue] = useState('')
    const [weightValue, setWeightValue] = useState('')
    const [units, setUnits] = useState(settingsStore.units)
    const [error, setError] = useState('')

    const muscleGroups = Array.from(new Set(exercises.map(item => item.type)));

    const resetAllFields = () => {
        setRepsValue('')
        setWeightValue('')
        setExercise('')
        setMuscleGroup('')
        setError('')
    };

    // TODO: date formats
    const handleSubmitEntry = async () => {
        if (muscleGroup && exercise && repsValue && weightValue && units) {
            const date = new Date().toLocaleDateString('ru-Ru', { year: '2-digit', month: '2-digit', day: '2-digit'})
            try {
                await addResult(
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
                        [{text: 'Завести упражнение', onPress: handleCreateExercise}]
                    )
                }
            } catch (e) {
                const error = `Failed to fetch exercises: ${e}`
                console.error(error);
                setError(error)
            }
        };

        getExercises()
    }, [])

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.itemWrapper}>
                {error && <Text>{error}</Text>}
                <Text style={styles.inputLabel}>{t('result.options.muscle')}:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    onSelect={(selectedItem, index) => setMuscleGroup(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.input}>
                            {!muscleGroup && <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseMuscle')}</Text>} 
                            {muscleGroup && <Text style={styles.exerciseText}>{toTitleCase(selectedItem)}</Text>}
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
                    data={exercises.filter(item => item.type === muscleGroup)}
                    onSelect={(selectedItem, index) => setExercise(selectedItem.title)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.input}>
                            {!exercise && <Text style={styles.exerciseTextPlaceholder}>{t('result.options.chooseExercise')}</Text>} 
                            {exercise && <Text style={styles.exerciseText}>{(selectedItem && selectedItem.title)}</Text>}
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
                    data={UNITS}
                    onSelect={(selectedItem) => setUnits(selectedItem.title)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>{(selectedItem && selectedItem.title) || settingsStore.units}</Text>
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
});

export default AddResultScreen;