import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';
import { Input, Label, Text, XStack, YStack } from 'tamagui';

import { DrawerParamList, HistoryStackParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import { getformattedDate, toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, globalStyles } from '@/app/shared/theme/global-styles';
import { TExercise } from '@/app/shared/types';
import Button from '@/app/shared/ui/button.ui';
import ErrorMessage from '@/app/shared/ui/error-message.ui';
import Loader from '@/app/shared/ui/loader.ui';

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

    const { t } = useTranslation();

    const handleChangeReps = (value: string) => {
        if (!value) {
            setNewReps('');
            return;
        }
        const num = Number(value);
        if (isNaN(num)) {
            setError(t('errors.repsMustBeNumber'));
            return;
        }
        if (num && num < 1) {
            setError(t('errors.repsMustBePositive'));
            return;
        }
        setNewReps(value);
    };

    const handleChangeWeight = (value: string) => {
        if (!value) {
            setNewWeight('');
            return;
        }
        const num = Number(value);
        if (isNaN(num)) {
            setError(t('errors.weightMustBeNumber'));
            return;
        }
        setNewWeight(value);
    };

    const handleSubmitEntry = async () => {
        if (newDate && newGroup && newExercise && newReps && !isNaN(Number(newWeight)) && newUnits) {
            const dateString = newDate instanceof Date ? newDate.toISOString() : newDate;
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
                Alert.alert(t('alerts.success'), t('alerts.newEntryAddedSuccess'), [
                    {
                        text: t('alerts.goToHistory'),
                        onPress: () => (navigation.getParent() as NavigationProp<DrawerParamList>)?.navigate('History'),
                    },
                ]);
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

    useEffect(() => {
        const getResult = async (resultId: number) => {
            setIsLoading(true);
            const res = await exerciseStore.fetchResultById(resultId);
            if (res.success && res.data) {
                const d = res.data;
                setNewDate(d.date);
                setNewExercise({ id: d.id, title: d.exercise, type: d.muscleGroup });
                setNewGroup(d.muscleGroup);
                setNewReps(String(d.reps));
                setNewWeight(String(d.weight));
                setNewUnits(d.units);
            } else if (!res.success && res.error) {
                setError(res.error);
            }
            setIsLoading(false);
        };
        void getResult(route.params.resultId);
    }, [route]);

    const onChange = (_: unknown, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setNewDate(selectedDate);
        }
    };

    const showMode = (currentMode: 'date') => {
        DateTimePickerAndroid.open({
            value: new Date(newDate),
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    if (isLoading) {
        return <Loader />;
    }

    const inputBorder = settingsStore.isDark ? COLORS.orange : COLORS.gray;

    return (
        <YStack flex={1} padding={20} gap={16}>
            {error && <ErrorMessage message={error} setError={setError} />}

            {/* Date */}
            <YStack gap={8}>
                <Label fontWeight="600" fontSize={16}>
                    {t('result.options.date')}:
                </Label>
                <XStack alignItems="center" gap={12}>
                    <Text fontSize={16} color="$color" flex={1}>
                        {getformattedDate(newDate)}
                    </Text>
                    <YStack
                        onPress={() => showMode('date')}
                        accessibilityRole="button"
                        accessibilityLabel="Change date"
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={24}
                            color={settingsStore.isDark ? COLORS.textDarkScreen : COLORS.gray}
                        />
                    </YStack>
                </XStack>
            </YStack>

            {/* Muscle Group */}
            <YStack gap={8}>
                <Label fontWeight="600" fontSize={16}>
                    {t('result.options.muscle')}:
                </Label>
                <SelectDropdown
                    data={MUSCLE_KEYS}
                    defaultValue={newGroup || undefined}
                    onSelect={(selectedItem) => {
                        setNewGroup(selectedItem);
                        setNewExercise(null);
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <YStack
                            borderWidth={1}
                            borderColor={inputBorder}
                            borderRadius={8}
                            padding={12}
                        >
                            {newGroup ? (
                                <Text fontSize={16} color="$color">
                                    {(selectedItem && toTitleCase(t('muscles.' + selectedItem))) || newGroup}
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
                <Label fontWeight="600" fontSize={16}>
                    {t('result.options.exercise')}:
                </Label>
                <SelectDropdown
                    data={
                        newGroup
                            ? exercises.filter((item) => item.type === newGroup)
                            : []
                    }
                    defaultValue={newExercise || undefined}
                    onSelect={(selectedItem) => {
                        setNewExercise(selectedItem);
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(_selectedItem) => (
                        <YStack
                            borderWidth={1}
                            borderColor={inputBorder}
                            borderRadius={8}
                            padding={12}
                        >
                            {newExercise ? (
                                <Text fontSize={16} color="$color">
                                    {toTitleCase(newExercise.title)}
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
                        testID="input-weight"
                        flex={1}
                        value={`${newWeight}`}
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
                        defaultValue={newUnits || undefined}
                        onSelect={(selectedItem) => setNewUnits(selectedItem)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={globalStyles.dropdownMenuStyle}
                        renderButton={(selectedItem) => (
                            <YStack
                                style={[
                                    globalStyles.dropdownButtonStyle,
                                    { borderColor: inputBorder },
                                ]}
                            >
                                <Text style={globalStyles.dropdownButtonTxtStyle}>
                                    {(selectedItem && t('units.' + selectedItem)) || newUnits}
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
                    testID="input-reps"
                    value={`${newReps}`}
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
    );
});

export default EditResultScreen;
