import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { Input, Label, YStack } from 'tamagui';

import { AddResultStackParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS } from '@/app/shared/constants/settings';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';
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
    const fontSize = useFontSize();

    const disabledSaveButton = !(muscleGroup && title.trim());

    const handleSuccess = () => {
        navigation.goBack();
    };

    const handleChangeTitle = (value: string) => {
        setTitle(value);
        if (!value.trim()) {
            setError(t('errors.titleCantBeEmpty'));
        } else if (value === '-') {
            setError(t('errors.titleCantBeThis'));
        } else {
            setError('');
        }
    };

    const handleCreateExercise = async () => {
        try {
            const titleToSave = title.trim();
            const exist = await exerciseStore.checkExerciseExists(titleToSave, muscleGroup);
            if (exist) {
                setError(t('errors.exerciseExists'));
                return;
            }

            const res = await exerciseStore.addExercise(titleToSave, muscleGroup);
            if (res.success) {
                Toast.show({
                    type: 'success',
                    text1: t('toasts.success'),
                    text2: t('alerts.exerciseAdded'),
                });
                handleSuccess();
            } else {
                setError(res.error || 'Failed to add exercise');
            }
        } catch (e) {
            setError(String(e));
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <YStack flex={1} padding={20} paddingTop={25} gap={16}>
                    {error && <ErrorMessage message={error} setError={setError} />}

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

                    <YStack gap={8}>
                        <Label fontWeight="600" fontSize={fontSize.large}>
                            {t('result.options.title')}:
                        </Label>
                        <Input
                            onChangeText={(value) => handleChangeTitle(value)}
                            value={title}
                            placeholder={t('result.options.titlePlaceholder')}
                            maxLength={50}
                            borderWidth={1}
                            borderColor={settingsStore.isDark ? COLORS.orange : COLORS.gray}
                            borderRadius={8}
                            padding={12}
                            fontSize={fontSize.large}
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
});

export default AddExerciseScreen;
