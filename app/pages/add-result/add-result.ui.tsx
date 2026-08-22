import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';
import { Input, Label, Text, XStack, YStack } from 'tamagui';

import { AddResultStackParamList, DrawerParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, globalStyles } from '@/app/shared/theme/global-styles';
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
        (navigation.getParent() as NavigationProp<DrawerParamList>)?.navigate('History');
    };

    useEffect(() => {
        if (!exerciseStore.isLoading && exercises.length === 0) {
            Alert.alert(t('alerts.noExerciseTitle'), t('alerts.noExercise'), [
                {
                    text: t('alerts.addExercise'),
                    onPress: () => navigation.navigate('AddExercise'),
                },
            ]);
        }
    }, [exercises.length]);

    const inputBorder = settingsStore.isDark ? COLORS.orange : COLORS.gray;

    return (
        <YStack flex={1} padding={20} gap={16}>
            {error && <ErrorMessage message={error} setError={setError} />}

            {/* Muscle Group */}
            <YStack gap={8}>
                <Label fontWeight="600" fontSize={16}>
                    {t('result.options.muscle')}:
                </Label>
                <SelectDropdown
                    data={MUSCLE_KEYS}
                    onSelect={(selectedItem) => setMuscleGroup(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <YStack
                            borderWidth={1}
                            borderColor={inputBorder}
                            borderRadius={8}
                            padding={12}
                        >
                            {muscleGroup ? (
                                <Text fontSize={16} color="$color">
                                    {toTitleCase(t('muscles.' + selectedItem))}
                                </Text>
                            ) : (
                                <Text fontSize={16} color="$colorMuted">
                                    {t('result.options.chooseMuscle')}
                                </Text>
                            )}
                        </YStack>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <YStack
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
                        </YStack>
                    )}
                />
            </YStack>

            {/* Exercise */}
            <YStack gap={8}>
                <Label
                    fontWeight="600"
                    fontSize={16}
                    opacity={!muscleGroup ? 0.3 : 1}
                >
                    {t('result.options.exercise')}:
                </Label>
                <SelectDropdown
                    disabled={!muscleGroup}
                    data={exercises.filter((item) => item.type === muscleGroup)}
                    onSelect={(_selectedItem, _) => setExercise(_selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <YStack
                            borderWidth={1}
                            borderColor={inputBorder}
                            borderRadius={8}
                            padding={12}
                            opacity={!muscleGroup ? 0.3 : 1}
                        >
                            {exercise ? (
                                <Text fontSize={16} color="$color">
                                    {selectedItem && selectedItem.title}
                                </Text>
                            ) : (
                                <Text fontSize={16} color="$colorMuted">
                                    {t('result.options.chooseExercise')}
                                </Text>
                            )}
                        </YStack>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <YStack
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
                        </YStack>
                    )}
                />
            </YStack>

            {/* Weight + Units */}
            <YStack gap={8}>
                <Label fontWeight="600" fontSize={16}>
                    {t('result.options.weight')}:
                </Label>
                <XStack gap={8}>
                    <Input
                        flex={1}
                        value={weightValue}
                        placeholder={t('result.options.whatWeight')}
                        onChangeText={(value) => handleChangeWeight(value)}
                        keyboardType="numeric"
                        borderWidth={1}
                        borderColor={inputBorder}
                        borderRadius={8}
                        padding={12}
                        fontSize={16}
                        color="$color"
                    />
                    <SelectDropdown
                        data={UNIT_KEYS}
                        defaultValue={settingsStore.units}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={globalStyles.dropdownMenuStyle}
                        onSelect={(selectedItem) => setUnits(selectedItem)}
                        renderButton={(selectedItem) => (
                            <YStack
                                style={[
                                    globalStyles.dropdownButtonStyle,
                                    { borderColor: inputBorder },
                                ]}
                            >
                                <Text style={globalStyles.dropdownButtonTxtStyle}>
                                    {(selectedItem && t('units.' + selectedItem)) ||
                                        settingsStore.units}
                                </Text>
                            </YStack>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <YStack
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
                            </YStack>
                        )}
                    />
                </XStack>
            </YStack>

            {/* Reps */}
            <YStack gap={8}>
                <Label fontWeight="600" fontSize={16}>
                    {t('result.options.reps')}:
                </Label>
                <Input
                    value={repsValue}
                    placeholder={t('result.options.howManyReps')}
                    onChangeText={(value) => handleChangeReps(value)}
                    keyboardType="numeric"
                    borderWidth={1}
                    borderColor={inputBorder}
                    borderRadius={8}
                    padding={12}
                    fontSize={16}
                    color="$color"
                />
            </YStack>

            {/* Buttons */}
            <YStack gap={16} marginTop={8}>
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
            </YStack>
        </YStack>
    );
});

export default AddResultScreen;
