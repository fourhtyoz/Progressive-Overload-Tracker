import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useTranslation } from 'react-i18next';
import { exerciseStore } from '../store/exerciseStore';
import { observer } from 'mobx-react-lite';

import Loader from '@/app/components/Loader';
import Exercise from '@/app/components/Exercise';
import ErrorMessage from '@/app/components/ErrorMessage';
import { settingsStore } from '@/app/store/settingsStore';
import { COLORS, FONT_SIZE, globalStyles } from '@/app/styles/globalStyles';
import { toTitleCase } from '@/app/utils/utils';
import { TExercise } from '@/app/types';

export default observer(function HistoryScreen() {
    const { t } = useTranslation();
    const { exercises, isLoading, error, muscleOptions, resetError } = exerciseStore;

    const [selectedMuscle, setSelectedMuscle] = useState('-');
    const [selectedSorting, setSelectedSorting] = useState({
        title: t('history.byDateRecentFirst'),
        type: 'desc',
    });

    const resetFilters = () => {
        setSelectedMuscle('-');
    };

    const isResetDisabled = selectedMuscle === '-';

    if (isLoading) {
        return <Loader />;
    }

    return (
        <ScrollView style={s.container}>
            {error && (
                <View style={{ marginBottom: 15 }}>
                    <ErrorMessage message={error} setError={resetError} />
                </View>
            )}
            <View style={s.filterWrapper}>
                <Text
                    style={[
                        s.filterTitle,
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {t('history.sorting')}:
                </Text>
                <SelectDropdown
                    data={[
                        { title: t('history.byDateRecentFirst'), type: 'desc' },
                        { title: t('history.byDateOldestFirst'), type: 'asc' },
                    ]}
                    defaultValue={{ title: t('history.byDateRecentFirst'), type: 'desc' }}
                    onSelect={(selectedItem, _) => setSelectedSorting(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(_) => (
                        <View style={s.dropdownButton}>
                            <Text
                                style={[
                                    s.selectedItem,
                                    {
                                        backgroundColor: settingsStore.isDark
                                            ? COLORS.orange
                                            : COLORS.black,
                                        color: settingsStore.isDark ? COLORS.black : COLORS.white,
                                    },
                                ]}
                            >
                                {selectedSorting.title}
                            </Text>
                        </View>
                    )}
                    renderItem={(item, index, _) => {
                        return (
                            <View
                                key={index}
                                style={[
                                    globalStyles.dropdownItemStyle,
                                    item.type === selectedSorting.type && {
                                        backgroundColor: settingsStore.isDark
                                            ? COLORS.orange
                                            : COLORS.selectedLight,
                                    },
                                ]}
                            >
                                <Text style={globalStyles.dropdownItemTxtStyle}>
                                    {toTitleCase(item.title)}
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
            <View style={s.filterWrapper}>
                <Text
                    style={[
                        s.filterTitle,
                        { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black },
                    ]}
                >
                    {t('history.table.header.muscle')}:
                </Text>
                <SelectDropdown
                    data={muscleOptions}
                    defaultValue={muscleOptions.filter((item) => item === '-')[0]}
                    onSelect={(selectedItem, _) => setSelectedMuscle(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={s.dropdownButton}>
                            {selectedMuscle === '-' ? (
                                <Text
                                    style={[
                                        s.selectedItem,
                                        {
                                            backgroundColor: settingsStore.isDark
                                                ? COLORS.orange
                                                : COLORS.black,
                                            color: settingsStore.isDark
                                                ? COLORS.black
                                                : COLORS.white,
                                        },
                                    ]}
                                >
                                    {'-'}
                                </Text>
                            ) : (
                                <Text
                                    style={[
                                        s.selectedItem,
                                        {
                                            backgroundColor: settingsStore.isDark
                                                ? COLORS.orange
                                                : COLORS.black,
                                            color: settingsStore.isDark
                                                ? COLORS.black
                                                : COLORS.white,
                                        },
                                    ]}
                                >
                                    {toTitleCase(selectedItem)}
                                </Text>
                            )}
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View
                            key={index}
                            style={[
                                globalStyles.dropdownItemStyle,
                                isSelected && {
                                    backgroundColor: settingsStore.isDark
                                        ? COLORS.orange
                                        : COLORS.selectedLight,
                                },
                            ]}
                        >
                            <Text style={globalStyles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <TouchableOpacity
                style={[s.resetButton, isResetDisabled && s.resetButtonDisabled]}
                onPress={resetFilters}
                disabled={isResetDisabled}
            >
                <Text style={[s.resetButtonText, isResetDisabled && s.resetButtonTextDisabled]}>
                    {t('history.resetFilter')}
                </Text>
            </TouchableOpacity>
            {selectedMuscle !== '-'
                ? exercises
                      .filter((item: TExercise) => item.type === selectedMuscle)
                      .map((item: TExercise) => (
                          <Exercise
                              key={item.id}
                              id={item.id}
                              title={item.title}
                              type={item.type}
                              sorting={selectedSorting.type}
                              setError={resetError}
                          />
                      ))
                : exercises.map((item: TExercise) => (
                      <Exercise
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          type={item.type}
                          sorting={selectedSorting.type}
                          setError={resetError}
                      />
                  ))}
        </ScrollView>
    );
});

const { width: screenWidth } = Dimensions.get('window');
const s = StyleSheet.create({
    notFound: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    text: {
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
    resetButtonTextDisabled: {
        color: COLORS.black,
    },
    resetButtonDisabled: {
        backgroundColor: COLORS.disabledBackground,
        opacity: 0.5,
    },
    resetButton: {
        backgroundColor: COLORS.red,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
    },
    resetButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZE.large,
        fontWeight: '600',
    },
    dropdownWrapper: {
        paddingHorizontal: 10,
    },
    selectedItem: {
        backgroundColor: COLORS.black,
        color: COLORS.white,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    filterTitle: {
        fontWeight: '700',
        paddingHorizontal: 10,
        alignItems: 'center',
        width: screenWidth / 3,
    },
    filterWrapper: {
        flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    dropdownButton: {
        width: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        padding: 10,
        marginTop: 15,
    },
    exerciseSection: {
        marginBottom: 20,
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.blackTransparentBorder,
    },
    exerciseHeader: {
        fontSize: FONT_SIZE.large,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    headerRow: {
        borderBottomWidth: 2,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: FONT_SIZE.normal,
    },
    cellAction: {
        textAlign: 'center',
    },
    headerCell: {
        fontWeight: 'bold',
    },
});
