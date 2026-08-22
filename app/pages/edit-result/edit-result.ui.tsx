import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import React, { useEffect,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert,Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';

import { HistoryStackParamList } from '@/app/navigation/drawer.navigator';
import { MUSCLE_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import { getformattedDate, toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { globalStyles } from '@/app/shared/theme/global-styles';
import { COLORS } from '@/app/shared/theme/global-styles';
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
                    data={MUSCLE_KEYS}
                    defaultValue={newGroup || undefined}
                    onSelect={(selectedItem) => {
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
                                    {(selectedItem && toTitleCase(t('muscles.' + selectedItem))) || newGroup}
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
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {t('result.options.exercise')}:
                </Text>
                <SelectDropdown
                    data={
                        newGroup
                            ? exercises.filter((item) =>
                                  item.type === newGroup
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
                    data={UNIT_KEYS}
                    defaultValue={newUnits || undefined}
                    onSelect={(selectedItem) => setNewUnits(selectedItem)}
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
                                {(selectedItem && t('units.' + selectedItem)) || newUnits}
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
