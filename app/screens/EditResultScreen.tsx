import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MUSCLES, UNITS } from '@/app/constants/settings';
import { getformattedDate, toTitleCase } from '@/app/utils/utils';
import SelectDropdown from 'react-native-select-dropdown';
import { globalStyles } from '@/app/styles/globalStyles';
import Button from '@/app/components/buttons/Button';
import { useTranslation } from 'react-i18next';
import { exerciseStore } from '@/app/store/exerciseStore';
import { observer } from 'mobx-react-lite';
import ErrorMessage from '@/app/components/ErrorMessage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { settingsStore } from '@/app/store/settingsStore';
import { COLORS } from '@/app/styles/globalStyles';
import Toast from 'react-native-toast-message';
import Loader from '@/app/components/Loader';
import { TExercise, TTranslatedItem } from '../types';
import { HistoryStackParamList } from '@/app/navigation/DrawerNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<HistoryStackParamList, 'EditResult'>;

const EditResultScreen = observer(({ navigation, route }: Props) => {
    const { exercises, muscleOptions } = exerciseStore;

    const [newDate, setNewDate] = useState<Date | string>(new Date());
    const [newGroup, setNewGroup] = useState<TTranslatedItem | string | null>(null);
    const [newExercise, setNewExercise] = useState<TExercise | null>(null);
    const [newReps, setNewReps] = useState<string>('');
    const [newWeight, setNewWeight] = useState<string>('');
    const [newUnits, setNewUnits] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();

    let muscleGroups = [];
    for (let title of muscleOptions) {
        const translatedName = MUSCLES.find((item) => item.title === title)?.[
            settingsStore.language as keyof TTranslatedItem
        ];
        const muscleObject = { title: title, translation: translatedName };
        muscleGroups.push(muscleObject);
    }

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
            const muscle = typeof newGroup === 'string' ? newGroup : newGroup.title;
            const res = await exerciseStore.updateResult(
                route.params.resultId,
                newExercise.title,
                newExercise.id,
                dateString,
                muscle,
                Number(newReps),
                Number(newWeight),
                newUnits
            );
            const { success, error } = res;
            if (success) {
                Alert.alert(t('alerts.success'), t('alerts.newEntryAddedSuccess'), [
                    {
                        text: t('alerts.goToHistory'),
                        onPress: () => (navigation.getParent() as any)?.navigate('History'),
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
        getResult(route.params.resultId);
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
                    {t('result.options.date')}:
                </Text>
                <Text
                    style={[
                        globalStyles.date,
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {getformattedDate(newDate)}
                </Text>
                <TouchableOpacity onPress={() => showMode('date')}>
                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={settingsStore.isDark ? COLORS.textDarkScreen : COLORS.gray}
                    />
                </TouchableOpacity>
            </View>
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
                    data={muscleGroups}
                    defaultValue={muscleGroups.filter((item) => item.title === newGroup)[0]}
                    onSelect={(selectedItem, _) => {
                        setNewGroup(selectedItem);
                        setNewExercise(null);
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View
                            style={[
                                globalStyles.input,
                                { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray },
                            ]}
                        >
                            {newGroup ? (
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
                                    {(selectedItem && selectedItem.translation) || newGroup}
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
                                {toTitleCase(item.translation)}
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
                    {t('result.options.exercise')}:
                </Text>
                <SelectDropdown
                    data={
                        newGroup
                            ? exercises.filter((item) =>
                                  item.type === (typeof newGroup === 'string' ? newGroup : newGroup.title)
                              )
                            : []
                    }
                    defaultValue={newExercise}
                    onSelect={(selectedItem) => {
                        setNewExercise(selectedItem);
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View
                            style={[
                                globalStyles.input,
                                { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray },
                            ]}
                        >
                            {newExercise ? (
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
                                    {toTitleCase(newExercise.title)}
                                </Text>
                            ) : (
                                <Text style={globalStyles.exerciseTextPlaceholder}>
                                    {t('result.options.chooseExercise')}
                                </Text>
                            )}
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => {
                        return (
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
                        );
                    }}
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
                    testID="input-weight"
                    style={[
                        globalStyles.inputWithOption,
                        {
                            color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black,
                            borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray,
                        },
                    ]}
                    value={`${newWeight}`}
                    placeholder={t('result.options.whatWeight')}
                    placeholderTextColor={COLORS.placeholderTextLight}
                    onChangeText={(value) => handleChangeWeight(value)}
                    keyboardType="numeric"
                />
                <SelectDropdown
                    data={UNITS}
                    defaultValue={UNITS.filter((item) => item.title === settingsStore.units)[0]}
                    onSelect={(selectedItem) => setNewUnits(selectedItem[settingsStore.language])}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View
                            style={[
                                globalStyles.dropdownButtonStyle,
                                { borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray },
                            ]}
                        >
                            <Text style={globalStyles.dropdownButtonTxtStyle}>
                                {(selectedItem && selectedItem[settingsStore.language]) || newUnits}
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
                                {item[settingsStore.language]}
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
                    testID="input-reps"
                    style={[
                        globalStyles.input,
                        {
                            color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black,
                            borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray,
                        },
                    ]}
                    value={`${newReps}`}
                    placeholder={t('result.options.howManyReps')}
                    placeholderTextColor={COLORS.placeholderTextLight}
                    onChangeText={(value) => handleChangeReps(value)}
                    keyboardType="numeric"
                />
            </View>
            <View style={globalStyles.buttonWrapper}>
                <Button
                    onPress={handleSubmitEntry}
                    text={t('result.buttons.updateResult')}
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder}
                />
            </View>
        </SafeAreaView>
    );
});

export default EditResultScreen;
