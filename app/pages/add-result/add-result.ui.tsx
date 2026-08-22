import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { useEffect,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert,Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';

import { AddResultStackParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { globalStyles } from '@/app/shared/theme/global-styles';
import { COLORS } from '@/app/shared/theme/global-styles';
import { TExercise } from '@/app/shared/types';
import Button from '@/app/shared/ui/button.ui';
import ErrorMessage from '@/app/shared/ui/error-message.ui';

type Props = NativeStackScreenProps<AddResultStackParamList, 'AddResultMain'>;

const AddResultScreen = observer(({ navigation }: Props) => {
    const { exercises } = exerciseStore;

    const [muscleGroup, setMuscleGroup] = useState('');
    const [exercise, setExercise] = useState<TExercise | null>(null);
    const [repsValue, setRepsValue] = useState('');
    const [weightValue, setWeightValue] = useState('');
    const [units, setUnits] = useState(settingsStore.units);
    const [error, setError] = useState('');

    const { t } = useTranslation();

    const resetAllFields = () => {
        setRepsValue('');
        setWeightValue('');
        setExercise(null);
        setMuscleGroup('');
        setError('');
    };

    const handleChangeReps = (value: string) => {
        const num = Number(value);
        if (isNaN(num)) {
            setError(t('errors.repsMustBeNumber'));
            return;
        }
        if (num && num < 1) {
            setError(t('errors.repsMustBePositive'));
            return;
        }
        setRepsValue(value);
    };

    const handleChangeWeight = (value: string) => {
        const num = Number(value);
        if (isNaN(num)) {
            setError(t('errors.weightMustBeNumber'));
            return;
        }
        setWeightValue(value);
    };

    const disabledSaveButton = !(
        muscleGroup &&
        exercise &&
        repsValue &&
        !isNaN(Number(weightValue)) &&
        units
    );

    const handleSubmitEntry = async () => {
        if (!exercise) return;
        const date = new Date().toISOString();
        const res = await exerciseStore.addResult(
            exercise.title,
            exercise.id,
            date,
            muscleGroup,
            Number(repsValue),
            Number(weightValue),
            units
        );
        if (res.success) {
            resetAllFields();
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('alerts.newEntryAddedSuccess'),
            });
        } else {
            setError('error' in res ? res.error || 'Failed to add result' : 'Failed to add result');
        }
    };

    const handleCreateExercise = () => {
        navigation.navigate('AddExercise');
    };

    const handleHistory = () => {
        (navigation.getParent() as any)?.navigate('History');
    };

    useEffect(() => {
        if (exercises.length === 0) {
            Alert.alert(t('alerts.noExerciseTitle'), t('alerts.noExercise'), [
                {
                    text: t('alerts.addExercise'),
                    onPress: () => navigation.navigate('AddExercise'),
                },
            ]);
        }
    }, []);

    return (
        <SafeAreaView style={globalStyles.wrapper}>
            {error && <ErrorMessage message={error} setError={setError} />}
            <View style={globalStyles.itemWrapper}>
                <Text
                    style={[
                        globalStyles.inputLabel,
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {t('result.options.muscle')}:
                </Text>
                <SelectDropdown
                    data={MUSCLE_KEYS}
                    onSelect={(selectedItem) => setMuscleGroup(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View
                            style={[
                                globalStyles.input,
                                { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray },
                            ]}
                        >
                            {muscleGroup ? (
                                <Text
                                    style={[
                                        globalStyles.exerciseText,
                                        {
                                            color: settingsStore.isDark
                                                ? COLORS.textDarkScreen
                                                : COLORS.black,
                                        },
                                    ]}
                                >
                                    {toTitleCase(t('muscles.' + selectedItem))}
                                </Text>
                            ) : (
                                <Text style={globalStyles.exerciseTextPlaceholder}>
                                    {t('result.options.chooseMuscle')}
                                </Text>
                            )}
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View
                            style={[
                                globalStyles.dropdownItemStyle,
                                isSelected && {
                                    backgroundColor: settingsStore.isDark
                                        ? COLORS.orange
                                        : COLORS.selectedLight,
                                },
                            ]}
                        >
                            <Text style={globalStyles.dropdownItemTxtStyle}>
                                {toTitleCase(t('muscles.' + item))}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text
                    style={[
                        globalStyles.inputLabel,
                        {
                            color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black,
                            opacity: !muscleGroup ? 0.3 : 1,
                        },
                    ]}
                >
                    {t('result.options.exercise')}:
                </Text>
                <SelectDropdown
                    disabled={!muscleGroup}
                    data={exercises.filter((item) => item.type === muscleGroup)}
                    onSelect={(selectedItem, _) => setExercise(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View
                            style={[
                                globalStyles.input,
                                {
                                    borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray,
                                    opacity: !muscleGroup ? 0.3 : 1,
                                },
                            ]}
                        >
                            {exercise ? (
                                <Text
                                    style={[
                                        globalStyles.exerciseText,
                                        {
                                            color: settingsStore.isDark
                                                ? COLORS.textDarkScreen
                                                : COLORS.black,
                                        },
                                    ]}
                                >
                                    {selectedItem && selectedItem.title}
                                </Text>
                            ) : (
                                <Text style={globalStyles.exerciseTextPlaceholder}>
                                    {t('result.options.chooseExercise')}
                                </Text>
                            )}
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View
                            style={[
                                globalStyles.dropdownItemStyle,
                                isSelected && {
                                    backgroundColor: settingsStore.isDark
                                        ? COLORS.orange
                                        : COLORS.selectedLight,
                                },
                            ]}
                        >
                            <Text style={globalStyles.dropdownItemTxtStyle}>
                                {index + 1}. {item.title}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text
                    style={[
                        globalStyles.inputLabel,
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {t('result.options.weight')}:
                </Text>
                <TextInput
                    style={[
                        globalStyles.inputWithOption,
                        {
                            color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black,
                            borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray,
                        },
                    ]}
                    value={weightValue}
                    placeholder={t('result.options.whatWeight')}
                    placeholderTextColor={COLORS.placeholderTextLight}
                    onChangeText={(value) => handleChangeWeight(value)}
                    keyboardType="numeric"
                />
                <SelectDropdown
                    data={UNIT_KEYS}
                    defaultValue={settingsStore.units}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    onSelect={(selectedItem) => setUnits(selectedItem)}
                    renderButton={(selectedItem) => (
                        <View
                            style={[
                                globalStyles.dropdownButtonStyle,
                                { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray },
                            ]}
                        >
                            <Text style={globalStyles.dropdownButtonTxtStyle}>
                                {(selectedItem && t('units.' + selectedItem)) ||
                                    settingsStore.units}
                            </Text>
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View
                            style={[
                                globalStyles.dropdownItemStyle,
                                isSelected && {
                                    backgroundColor: settingsStore.isDark
                                        ? COLORS.orange
                                        : COLORS.selectedLight,
                                },
                            ]}
                        >
                            <Text style={globalStyles.dropdownItemTxtStyle}>
                                {t('units.' + item)}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text
                    style={[
                        globalStyles.inputLabel,
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {t('result.options.reps')}:
                </Text>
                <TextInput
                    style={[
                        globalStyles.input,
                        {
                            color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black,
                            borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray,
                        },
                    ]}
                    value={repsValue}
                    placeholder={t('result.options.howManyReps')}
                    placeholderTextColor={COLORS.placeholderTextLight}
                    onChangeText={(value) => handleChangeReps(value)}
                    keyboardType="numeric"
                />
            </View>
            <View style={globalStyles.buttonWrapper}>
                <Button
                    onPress={handleSubmitEntry}
                    text={t('result.buttons.submit')}
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder}
                    disabled={disabledSaveButton}
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
