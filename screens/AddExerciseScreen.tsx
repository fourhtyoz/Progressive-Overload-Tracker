import React, { useState } from 'react';
import { View, SafeAreaView, Text, TextInput, Alert } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { toTitleCase } from '@/utils/helpFunctions';
import { globalStyles } from '@/styles/globalStyles';
import Button from '@/components/buttons/Button';
import { muscleGroups } from '@/utils/constants';
import { addExercise } from '@/services/db';
import ErrorMessage from '@/components/ErrorMessage';
import { observer } from 'mobx-react-lite';
import { COLORS } from '@/styles/colors';
import { settingsStore } from '@/store/store';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';


type Props = DrawerScreenProps<DrawerParamList, 'AddExercise'>;


const AddExerciseScreen = observer(({ navigation }: Props) => {
    const [muscleGroup, setMuscleGroup] = useState('');
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const { t } = useTranslation();

    const disabledSaveButton = !(muscleGroup && title)

    console.log('title', title)

    const handleSucess = () => {
        navigation.navigate('AddResult')
    }

    const handleCreateExercise = async () => {
        if (!disabledSaveButton) {
            try {
                await addExercise(title, muscleGroup)
                Alert.alert(
                    'Успех',
                    'Упражнение было успешно добавлено',
                    [
                        {text: 'Отлично', onPress: handleSucess},
                    ]
                )
                setMuscleGroup('');
                setTitle('');
                setError('');
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
    }

    return (
        <SafeAreaView style={globalStyles.wrapper}>
            {error && <View style={{ marginTop: 25 }}><ErrorMessage message={error} setError={setError} /></View>}
             <View style={globalStyles.itemWrapper}>
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>Type:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    defaultValue={muscleGroup}
                    onSelect={(selectedItem, index) => setMuscleGroup(selectedItem)}
                    showsVerticalScrollIndicator={true}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[globalStyles.input, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray}]}>
                            {muscleGroup 
                            ? <Text style={[globalStyles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{toTitleCase(selectedItem)}</Text> 
                            : <Text style={globalStyles.exerciseTextPlaceholder}>{'Choose a muscle group'}</Text>
                            }
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View 
                            style={[
                                globalStyles.dropdownItemStyle,
                                isSelected && {
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight,
                                },
                            ]}
                        >
                            <Text style={globalStyles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>Name:</Text>
                <TextInput 
                    onChangeText={setTitle}
                    defaultValue={title}
                    placeholder='Name of the exercise' 
                    placeholderTextColor={'#a9a9a9'}
                    style={[globalStyles.input,  { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]} 
                />
            </View>
            <Button 
                onPress={handleCreateExercise} 
                text={'Create a new exercise'}
                pressedBgColor={COLORS.orange}
                borderColor={COLORS.blackTransparentBorder} 
                disabled={disabledSaveButton}
            />
        </SafeAreaView>
    )
});

export default AddExerciseScreen;