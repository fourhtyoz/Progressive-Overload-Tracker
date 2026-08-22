import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { Input, Label, XStack, YStack } from 'tamagui';

import { AddResultStackParamList, DrawerParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { TExercise } from '@/app/shared/types';
import Button from '@/app/shared/ui/button.ui';
import ErrorMessage from '@/app/shared/ui/error-message.ui';
import {
    DropdownInput,
    DropdownItem,
    DropdownItemText,
    DropdownPlaceholder,
    DropdownText,
    ThemedDropdown,
} from '@/app/shared/ui/themed-dropdown.ui';

type Props = NativeStackScreenProps<AddResultStackParamList, 'AddResultMain'>;

const AddResultScreen = observer(({ navigation }: Props) => {
    const { exercises } = exerciseStore;

    const [muscleGroup, setMuscleGroup] = useState('');
    const [exercise, setExercise] = useState<TExercise | null>(null);
    const [repsValue, setRepsValue] = useState('');
    const [weightValue, setWeightValue] = useState('');
    const [units, setUnits] = useState<'kg' | 'lb'>(settingsStore.units);
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
        if (num < 1) {
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
        if (num < 0) {
            setError(t('errors.weightMustBePositive'));
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
            setError('error' in res ? res.error || t('errors.failedToAddResult') : t('errors.failedToAddResult'));
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
                <ThemedDropdown
                    data={MUSCLE_KEYS}
                    onSelect={(selectedItem) => setMuscleGroup(selectedItem)}
                    showsVerticalScrollIndicator
                    renderButton={() => (
                        <DropdownInput>
                            {muscleGroup ? (
                                <DropdownText>
                                    {toTitleCase(t('muscles.' + muscleGroup))}
                                </DropdownText>
                            ) : (
                                <DropdownPlaceholder>
                                    {t('result.options.chooseMuscle')}
                                </DropdownPlaceholder>
                            )}
                        </DropdownInput>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <DropdownItem isSelected={isSelected}>
                            <DropdownItemText>
                                {toTitleCase(t('muscles.' + item))}
                            </DropdownItemText>
                        </DropdownItem>
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
                <ThemedDropdown
                    disabled={!muscleGroup}
                    data={exercises.filter((item) => item.type === muscleGroup)}
                    onSelect={(_selectedItem, _) => setExercise(_selectedItem)}
                    showsVerticalScrollIndicator
                    renderButton={() => (
                        <DropdownInput>
                            {exercise ? (
                                <DropdownText>{exercise.title}</DropdownText>
                            ) : (
                                <DropdownPlaceholder>
                                    {t('result.options.chooseExercise')}
                                </DropdownPlaceholder>
                            )}
                        </DropdownInput>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <DropdownItem isSelected={isSelected}>
                            <DropdownItemText>
                                {index + 1}. {item.title}
                            </DropdownItemText>
                        </DropdownItem>
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
                    <ThemedDropdown
                        data={UNIT_KEYS}
                        defaultValue={settingsStore.units}
                        onSelect={(selectedItem) => setUnits(selectedItem as 'kg' | 'lb')}
                        renderButton={() => (
                            <DropdownInput>
                                <DropdownText>
                                    {t('units.' + units)}
                                </DropdownText>
                            </DropdownInput>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <DropdownItem isSelected={isSelected}>
                                <DropdownItemText>
                                    {t('units.' + item)}
                                </DropdownItemText>
                            </DropdownItem>
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
