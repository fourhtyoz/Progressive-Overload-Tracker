import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { Input, Label, Text, XStack, YStack } from 'tamagui';

import { HistoryStackParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import {
    getformattedDate,
    toLocalDate,
    toLocalDateString,
    toTitleCase,
} from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';
import { TExercise } from '@/app/shared/types';
import Button from '@/app/shared/ui/button.ui';
import ErrorMessage from '@/app/shared/ui/error-message.ui';
import Loader from '@/app/shared/ui/loader.ui';
import {
    DropdownInput,
    DropdownItem,
    DropdownItemText,
    DropdownPlaceholder,
    DropdownText,
    ThemedDropdown,
} from '@/app/shared/ui/themed-dropdown.ui';

type Props = NativeStackScreenProps<HistoryStackParamList, 'EditResult'>;

const EditResultScreen = observer(({ navigation, route }: Props) => {
    const { exercises } = exerciseStore;

    const [newDate, setNewDate] = useState<Date | string>(new Date());
    const [newGroup, setNewGroup] = useState<string | null>(null);
    const [newExercise, setNewExercise] = useState<TExercise | null>(null);
    const [newReps, setNewReps] = useState<string>('');
    const [newWeight, setNewWeight] = useState<string>('');
    const [newUnits, setNewUnits] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const { t } = useTranslation();
    const fontSize = useFontSize();

    const handleChangeReps = (value: string) => {
        if (!value) {
            setNewReps('');
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
        setNewReps(value);
        setError('');
    };

    const handleChangeWeight = (value: string) => {
        if (!value) {
            setNewWeight('');
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
        setNewWeight(value);
        setError('');
    };

    const handleSubmitEntry = async () => {
        if (
            newDate &&
            newGroup &&
            newExercise &&
            newReps &&
            !isNaN(Number(newWeight)) &&
            newUnits
        ) {
            const dateString = newDate instanceof Date ? toLocalDateString(newDate) : newDate;
            const res = await exerciseStore.updateResult(
                route.params.resultId,
                newExercise.title,
                newExercise.id,
                dateString,
                newGroup,
                Number(newReps),
                Number(newWeight),
                newUnits
            );
            const { success, error } = res;
            if (success) {
                Toast.show({
                    type: 'success',
                    text1: t('toasts.success'),
                    text2: t('alerts.newEntryUpdatedSuccess'),
                });
                navigation.goBack();
            } else {
                const e = `${t('errors.failedUpdateResult')} ${error}`;
                setError(e);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: t('toasts.error'),
                text2: t('alerts.toAddFieldsRequired'),
            });
        }
    };

    const fetchResult = async (resultId: number) => {
        setIsLoading(true);
        setError('');
        const res = await exerciseStore.fetchResultById(resultId);
        if (res.success && res.data) {
            const d = res.data;
            setNewDate(d.date);
            setNewExercise({ id: d.exercise_id, title: d.exercise, type: d.muscleGroup });
            setNewGroup(d.muscleGroup);
            setNewReps(String(d.reps));
            setNewWeight(String(d.weight));
            setNewUnits(d.units);
        } else if (!res.success && res.error) {
            setError(res.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        void fetchResult(route.params.resultId);
    }, [route.params.resultId]);

    const onChange = (_: unknown, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setNewDate(selectedDate);
        }
    };

    const showMode = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: toLocalDate(newDate),
                onChange,
                mode: 'date',
                is24Hour: true,
            });
        } else {
            setShowPicker(true);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    const inputBorder = settingsStore.isDark ? COLORS.orange : COLORS.gray;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <YStack flex={1} padding={20} gap={16}>
                    {error && (
                        <YStack gap={8}>
                            <ErrorMessage message={error} setError={setError} />
                            <Button
                                text={t('alerts.retry')}
                                onPress={() => fetchResult(route.params.resultId)}
                                pressedBgColor={COLORS.orange}
                                borderColor={COLORS.blackTransparentBorder}
                            />
                        </YStack>
                    )}

                    {/* Date */}
                    <YStack gap={8}>
                        <Label fontWeight="600" fontSize={fontSize.large}>
                            {t('result.options.date')}:
                        </Label>
                        <XStack alignItems="center" gap={12}>
                            <Text fontSize={fontSize.large} color="$color" flex={1}>
                                {getformattedDate(newDate)}
                            </Text>
                            <YStack
                                onPress={showMode}
                                accessibilityRole="button"
                                accessibilityLabel={t('errors.changeDate')}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={24}
                                    color={
                                        settingsStore.isDark ? COLORS.textDarkScreen : COLORS.gray
                                    }
                                />
                            </YStack>
                        </XStack>
                        {showPicker && Platform.OS === 'ios' && (
                            <DateTimePicker
                                value={toLocalDate(newDate)}
                                mode="date"
                                display="spinner"
                                onChange={onChange}
                            />
                        )}
                    </YStack>

                    {/* Muscle Group */}
                    <YStack gap={8}>
                        <Label fontWeight="600" fontSize={fontSize.large}>
                            {t('result.options.muscle')}:
                        </Label>
                        <ThemedDropdown
                            data={MUSCLE_KEYS}
                            defaultValue={newGroup || undefined}
                            onSelect={(selectedItem) => {
                                setNewGroup(selectedItem);
                                setNewExercise(null);
                            }}
                            showsVerticalScrollIndicator
                            renderButton={() => (
                                <DropdownInput>
                                    {newGroup ? (
                                        <DropdownText>
                                            {toTitleCase(t('muscles.' + newGroup))}
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
                        <Label fontWeight="600" fontSize={fontSize.large}>
                            {t('result.options.exercise')}:
                        </Label>
                        <ThemedDropdown
                            data={
                                newGroup ? exercises.filter((item) => item.type === newGroup) : []
                            }
                            defaultValue={newExercise || undefined}
                            onSelect={(selectedItem) => {
                                setNewExercise(selectedItem);
                            }}
                            showsVerticalScrollIndicator
                            renderButton={() => (
                                <DropdownInput>
                                    {newExercise ? (
                                        <DropdownText>
                                            {toTitleCase(newExercise.title)}
                                        </DropdownText>
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
                        <Label fontWeight="600" fontSize={fontSize.large}>
                            {t('result.options.weight')}:
                        </Label>
                        <XStack gap={8}>
                            <Input
                                testID="input-weight"
                                flex={1}
                                value={`${newWeight}`}
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
                                defaultValue={newUnits || undefined}
                                onSelect={(selectedItem) => setNewUnits(selectedItem)}
                                renderButton={() => (
                                    <DropdownInput>
                                        <DropdownText>
                                            {newUnits ? t('units.' + newUnits) : ''}
                                        </DropdownText>
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
                            testID="input-reps"
                            value={`${newReps}`}
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

                    {/* Submit */}
                    <YStack gap={16} marginTop={8}>
                        <Button
                            onPress={handleSubmitEntry}
                            text={t('result.buttons.updateResult')}
                            pressedBgColor={COLORS.orange}
                            borderColor={COLORS.blackTransparentBorder}
                        />
                    </YStack>
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
});

export default EditResultScreen;
