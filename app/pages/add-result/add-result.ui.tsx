import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { Input, Label, Text, XStack, YStack } from 'tamagui';

import { AddResultStackParamList, DrawerParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import { toLocalDateString, toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';
import { TExercise, TResult } from '@/app/shared/types';
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
    const [setsValue, setSetsValue] = useState('1');
    const [repsValue, setRepsValue] = useState('');
    const [weightValue, setWeightValue] = useState('');
    const [units, setUnits] = useState<'kg' | 'lb'>(settingsStore.units);
    const [error, setError] = useState('');
    const [lastResult, setLastResult] = useState<TResult | null>(null);

    const { t } = useTranslation();
    const fontSize = useFontSize();

    useEffect(() => {
        if (exercise) {
            void exerciseStore.fetchLatestResult(exercise.id).then(setLastResult);
        } else {
            setLastResult(null);
        }
    }, [exercise]);

    const resetAllFields = () => {
        setSetsValue('1');
        setRepsValue('');
        setWeightValue('');
        setExercise(null);
        setMuscleGroup('');
        setError('');
    };

    const handleChangeSets = (value: string) => {
        if (value === '') {
            setSetsValue('');
            setError('');
            return;
        }
        const num = Number(value);
        if (isNaN(num)) {
            setError(t('errors.setsMustBeNumber'));
            return;
        }
        if (num < 1) {
            setError(t('errors.setsMustBePositive'));
            return;
        }
        setSetsValue(value);
        setError('');
    };

    const handleChangeReps = (value: string) => {
        if (value === '') {
            setRepsValue('');
            setError('');
            return;
        }
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
        setError('');
    };

    const handleChangeWeight = (value: string) => {
        if (value === '') {
            setWeightValue('');
            setError('');
            return;
        }
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
        setError('');
    };

    const disabledSaveButton = !(
        muscleGroup &&
        exercise &&
        setsValue &&
        repsValue &&
        !isNaN(Number(weightValue)) &&
        units
    );

    const handleSubmitEntry = async () => {
        if (!exercise) return;
        const date = toLocalDateString(new Date());
        const res = await exerciseStore.addResult(
            exercise.id,
            date,
            Number(repsValue),
            Number(weightValue),
            units,
            Number(setsValue)
        );
        if (res.success) {
            resetAllFields();
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('alerts.newEntryAddedSuccess'),
            });
        } else {
            setError(
                'error' in res
                    ? res.error || t('errors.failedToAddResult')
                    : t('errors.failedToAddResult')
            );
        }
    };

    const handleCreateExercise = () => {
        navigation.navigate('AddExercise');
    };

    const handleHistory = () => {
        (navigation.getParent() as NavigationProp<DrawerParamList>)?.navigate('History');
    };

    const inputBorder = settingsStore.isDark ? COLORS.orange : COLORS.gray;

    if (!exerciseStore.isLoading && exercises.length === 0) {
        return (
            <YStack flex={1} padding={20} gap={16} alignItems="center" justifyContent="center">
                <Text fontSize={fontSize.large} fontWeight="600" color="$colorMuted">
                    {t('alerts.noExerciseTitle')}
                </Text>
                <Text fontSize={fontSize.normal} color="$colorMuted" textAlign="center">
                    {t('alerts.noExercise')}
                </Text>
                <Button
                    text={t('alerts.addExercise')}
                    onPress={handleCreateExercise}
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder}
                />
            </YStack>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <YStack flex={1} padding={20} gap={16}>
                    {error && <ErrorMessage message={error} setError={setError} />}

                    {/* Muscle Group */}
                    <YStack gap={8}>
                        <Label fontWeight="600" fontSize={fontSize.large}>
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
                            fontSize={fontSize.large}
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
                        {lastResult && (
                            <Text fontSize={fontSize.normal} color="$colorMuted">
                                {t('result.lastTime')}:{' '}
                                {lastResult.weight
                                    ? `${lastResult.weight} ${t('units.' + lastResult.units)} × ${lastResult.reps}`
                                    : `${t('result.bodyweight')} × ${lastResult.reps}`}
                            </Text>
                        )}
                    </YStack>

                    {/* Sets */}
                    <YStack gap={8}>
                        <Label fontWeight="600" fontSize={fontSize.large}>
                            {t('result.options.sets')}:
                        </Label>
                        <Input
                            value={setsValue}
                            placeholder={t('result.options.howManySets')}
                            onChangeText={(value) => handleChangeSets(value)}
                            keyboardType="numeric"
                            maxLength={4}
                            borderWidth={1}
                            borderColor={inputBorder}
                            borderRadius={8}
                            padding={12}
                            fontSize={fontSize.large}
                            color="$color"
                        />
                    </YStack>

                    {/* Weight + Units */}
                    <YStack gap={8}>
                        <Label fontWeight="600" fontSize={fontSize.large}>
                            {t('result.options.weight')}:
                        </Label>
                        <XStack gap={8}>
                            <Input
                                flex={1}
                                value={weightValue}
                                placeholder={t('result.options.whatWeight')}
                                onChangeText={(value) => handleChangeWeight(value)}
                                keyboardType="numeric"
                                maxLength={6}
                                borderWidth={1}
                                borderColor={inputBorder}
                                borderRadius={8}
                                padding={12}
                                fontSize={fontSize.large}
                                color="$color"
                            />
                            <ThemedDropdown
                                data={UNIT_KEYS}
                                defaultValue={units}
                                onSelect={(selectedItem) => setUnits(selectedItem as 'kg' | 'lb')}
                                renderButton={() => (
                                    <DropdownInput>
                                        <DropdownText>{t('units.' + units)}</DropdownText>
                                    </DropdownInput>
                                )}
                                renderItem={(item, _, isSelected) => (
                                    <DropdownItem isSelected={isSelected}>
                                        <DropdownItemText>{t('units.' + item)}</DropdownItemText>
                                    </DropdownItem>
                                )}
                            />
                        </XStack>
                    </YStack>

                    {/* Reps */}
                    <YStack gap={8}>
                        <Label fontWeight="600" fontSize={fontSize.large}>
                            {t('result.options.reps')}:
                        </Label>
                        <Input
                            value={repsValue}
                            placeholder={t('result.options.howManyReps')}
                            onChangeText={(value) => handleChangeReps(value)}
                            keyboardType="numeric"
                            maxLength={4}
                            borderWidth={1}
                            borderColor={inputBorder}
                            borderRadius={8}
                            padding={12}
                            fontSize={fontSize.large}
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
});

export default AddResultScreen;
