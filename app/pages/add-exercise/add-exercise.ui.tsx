import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { Input, Label, YStack } from 'tamagui';

import { AddResultStackParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS } from '@/app/shared/constants/settings';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
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

type Props = NativeStackScreenProps<AddResultStackParamList, 'AddExercise'>;

const AddExerciseScreen = observer(({ navigation }: Props) => {
    const [muscleGroup, setMuscleGroup] = useState('');
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const { t } = useTranslation();

    const disabledSaveButton = !(muscleGroup && title);

    const handleSuccess = () => {
        navigation.goBack();
    };

    const handleChangeTitle = (value: string) => {
        if (!value) {
            setError(t('errors.titleCantBeEmpty'));
            return;
        }
        if (value === '-') {
            setError(t('errors.titleCantBeThis'));
            return;
        }
        setTitle(value);
    };

    const handleCreateExercise = async () => {
        const exist = await exerciseStore.checkExerciseExists(title, muscleGroup);
        if (exist) {
            setError(t('errors.exerciseExists'));
            return;
        }

        const res = await exerciseStore.addExercise(title, muscleGroup);
        if (res.success) {
            Alert.alert(t('alerts.success'), t('alerts.exerciseAdded'), [
                { text: t('alerts.great'), onPress: handleSuccess },
            ]);
            setMuscleGroup('');
            setTitle('');
            setError('');
        } else {
            setError(res.error);
        }
    };

    return (
        <YStack flex={1} padding={20} paddingTop={25} gap={16}>
            {error && <ErrorMessage message={error} setError={setError} />}

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

            <YStack gap={8}>
                <Label fontWeight="600" fontSize={16}>
                    {t('result.options.title')}:
                </Label>
                <Input
                    onChangeText={(value) => handleChangeTitle(value)}
                    defaultValue={title}
                    placeholder={t('result.options.titlePlaceholder')}
                    borderWidth={1}
                    borderColor={settingsStore.isDark ? COLORS.orange : COLORS.gray}
                    borderRadius={8}
                    padding={12}
                    fontSize={16}
                    color="$color"
                />
            </YStack>

            <Button
                testID="result-createExercise"
                onPress={handleCreateExercise}
                text={t('result.options.createExercise')}
                pressedBgColor={COLORS.orange}
                borderColor={COLORS.blackTransparentBorder}
                disabled={disabledSaveButton}
            />
        </YStack>
    );
});

export default AddExerciseScreen;
