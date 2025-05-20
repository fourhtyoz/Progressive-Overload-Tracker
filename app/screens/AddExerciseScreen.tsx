import React, { useState } from 'react';
import { View, SafeAreaView, Text, TextInput, Alert } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/app/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { toTitleCase } from '@/app/utils/utils';
import Button from '@/app/components/buttons/Button';
import { MUSCLES } from '@/app/constants/settings';
import { addExercise } from '@/app/services/db';
import ErrorMessage from '@/app/components/ErrorMessage';
import { observer } from 'mobx-react-lite';
import { COLORS, globalStyles } from '@/app/styles/globalStyles';
import { settingsStore } from '@/app/store/settingsStore';
import { useTranslation } from 'react-i18next';

type Props = DrawerScreenProps<DrawerParamList, 'AddExercise'>;

const AddExerciseScreen = observer(({ navigation }: Props) => {
    const [muscleGroup, setMuscleGroup] = useState('');
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const { t } = useTranslation();

    const disabledSaveButton = !(muscleGroup && title);

    const handleSucess = () => {
        navigation.navigate('AddResult');
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
        const res = await addExercise(title, muscleGroup);
        const { success, error } = res;
        if (success) {
            Alert.alert(t('alerts.success'), t('alerts.exerciseAdded'), [
                { text: t('alerts.great'), onPress: handleSucess },
            ]);
            setMuscleGroup('');
            setTitle('');
            setError('');
        } else {
            setError(String(error));
        }
    };

    return (
        <SafeAreaView style={[globalStyles.wrapper, { marginTop: 25 }]}>
            {error && (
                <View style={{ marginTop: 25 }}>
                    <ErrorMessage message={error} setError={setError} />
                </View>
            )}
            <View style={globalStyles.itemWrapper}>
                <Text
                    testID="result-muscle"
                    style={[
                        globalStyles.inputLabel,
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {t('result.options.muscle')}:
                </Text>
                <SelectDropdown
                    data={MUSCLES}
                    onSelect={(selectedItem, _) => setMuscleGroup(selectedItem.title)}
                    showsVerticalScrollIndicator={true}
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
                                    {toTitleCase(selectedItem[settingsStore.language])}
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
                                {toTitleCase(item[settingsStore.language])}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View style={globalStyles.itemWrapper}>
                <Text
                    testID="result-title"
                    style={[
                        globalStyles.inputLabel,
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {t('result.options.title')}:
                </Text>
                <TextInput
                    onChangeText={(value) => handleChangeTitle(value)}
                    defaultValue={title}
                    placeholder={t('result.options.titlePlaceholder')}
                    placeholderTextColor={COLORS.placeholderTextLight}
                    style={[
                        globalStyles.input,
                        {
                            color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black,
                            borderColor: settingsStore.isDark ? COLORS.orange : COLORS.gray,
                        },
                    ]}
                />
            </View>
            <Button
                testID="result-createExercise"
                onPress={handleCreateExercise}
                text={t('result.options.createExercise')}
                pressedBgColor={COLORS.orange}
                borderColor={COLORS.blackTransparentBorder}
                disabled={disabledSaveButton}
            />
        </SafeAreaView>
    );
});

export default AddExerciseScreen;
