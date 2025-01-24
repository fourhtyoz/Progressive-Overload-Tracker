import React, { useState } from 'react';
import { View, SafeAreaView, Text, TextInput, Alert } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { toTitleCase } from '@/utils/helpFunctions';
import { globalStyles } from '@/styles/globalStyles';
import Button from '@/components/buttons/Button';
import { MUSCLES } from '@/constants/settings';
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

    const handleSucess = () => {
        navigation.navigate('AddResult')
    }

    const handleChangeTitle = (value: string) => {
        if (!value) {
            setError(t('errors.titleCantBeEmpty'));
            return;
        }
        if (value === '-') {
            setError(t('errors.titleCantBeThis'))
            return
        }
        setTitle(value)
    }

    const handleCreateExercise = async () => {
        if (!disabledSaveButton) {
            try {
                await addExercise(title, muscleGroup)
                Alert.alert(
                    t('alerts.success'),
                    t('alerts.exerciseAdded'),
                    [{text: t('alerts.great'), onPress: handleSucess}]
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
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.muscle')}:</Text>
                <SelectDropdown
                    data={MUSCLES}
                    onSelect={(selectedItem, _) => setMuscleGroup(selectedItem.title)}
                    showsVerticalScrollIndicator={true}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={[globalStyles.input, { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray}]}>
                            {muscleGroup 
                            ? <Text style={[globalStyles.exerciseText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{toTitleCase(selectedItem[settingsStore.language])}</Text> 
                            : <Text style={globalStyles.exerciseTextPlaceholder}>{t('result.options.chooseMuscle')}</Text>
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
                            <Text style={globalStyles.dropdownItemTxtStyle}>{toTitleCase(item[settingsStore.language])}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text style={[globalStyles.inputLabel, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('result.options.title')}:</Text>
                <TextInput 
                    onChangeText={(value) => handleChangeTitle(value)}
                    defaultValue={title}
                    placeholder={t('result.options.titlePlaceholder')}
                    placeholderTextColor={COLORS.placeholderTextLight}
                    style={[globalStyles.input,  { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black, borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray }]} 
                />
            </View>
            <Button 
                onPress={handleCreateExercise} 
                text={t('result.options.createExercise')}
                pressedBgColor={COLORS.orange}
                borderColor={COLORS.blackTransparentBorder} 
                disabled={disabledSaveButton}
            />
        </SafeAreaView>
    )
});

export default AddExerciseScreen;