import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Button, Label, Text, XStack, YStack } from 'tamagui';

import Exercise from '@/app/pages/history/ui/exercise-row.ui';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, FONT_SIZE, globalStyles } from '@/app/shared/theme/global-styles';
import { TExercise } from '@/app/shared/types';
import ErrorMessage from '@/app/shared/ui/error-message.ui';
import Loader from '@/app/shared/ui/loader.ui';

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
    const isDark = settingsStore.isDark;

    if (isLoading) {
        return <Loader />;
    }

    return (
        <ScrollView style={{ flex: 1, padding: 10, marginTop: 15 }}>
            {error && (
                <YStack marginBottom={15}>
                    <ErrorMessage message={error} setError={resetError} />
                </YStack>
            )}

            {/* Sorting */}
            <XStack alignItems="center" marginTop={5}>
                <Label
                    fontWeight="700"
                    paddingHorizontal={10}
                    width="33%"
                    color={isDark ? COLORS.textDarkScreen : COLORS.black}
                >
                    {t('history.sorting')}:
                </Label>
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
                        <XStack width="100%" justifyContent="flex-start">
                            <Text
                                backgroundColor={isDark ? COLORS.orange : COLORS.black}
                                color={isDark ? COLORS.black : COLORS.white}
                                paddingHorizontal={10}
                                borderRadius={6}
                            >
                                {selectedSorting.title}
                            </Text>
                        </XStack>
                    )}
                    renderItem={(item, index, _) => (
                        <YStack
                            key={index}
                            style={[
                                globalStyles.dropdownItemStyle,
                                item.type === selectedSorting.type && {
                                    backgroundColor: isDark ? COLORS.orange : COLORS.selectedLight,
                                },
                            ]}
                        >
                            <Text style={globalStyles.dropdownItemTxtStyle}>
                                {toTitleCase(item.title)}
                            </Text>
                        </YStack>
                    )}
                />
            </XStack>

            {/* Muscle Filter */}
            <XStack alignItems="center" marginTop={5}>
                <Label
                    fontWeight="700"
                    paddingHorizontal={10}
                    width="33%"
                    color={isDark ? COLORS.textDarkScreen : COLORS.black}
                >
                    {t('history.table.header.muscle')}:
                </Label>
                <SelectDropdown
                    data={muscleOptions}
                    defaultValue={undefined}
                    onSelect={(selectedItem, _) => setSelectedMuscle(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={globalStyles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <XStack width="100%" justifyContent="flex-start">
                            <Text
                                backgroundColor={isDark ? COLORS.orange : COLORS.black}
                                color={isDark ? COLORS.black : COLORS.white}
                                paddingHorizontal={10}
                                borderRadius={6}
                            >
                                {selectedMuscle === '-' ? '-' : toTitleCase(selectedItem)}
                            </Text>
                        </XStack>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <YStack
                            key={index}
                            style={[
                                globalStyles.dropdownItemStyle,
                                isSelected && {
                                    backgroundColor: isDark ? COLORS.orange : COLORS.selectedLight,
                                },
                            ]}
                        >
                            <Text style={globalStyles.dropdownItemTxtStyle}>
                                {toTitleCase(item)}
                            </Text>
                        </YStack>
                    )}
                />
            </XStack>

            {/* Reset Button */}
            <Button
                backgroundColor={COLORS.red}
                pressStyle={{ backgroundColor: COLORS.red }}
                paddingVertical={12}
                borderRadius={8}
                alignItems="center"
                marginVertical={16}
                opacity={isResetDisabled ? 0.5 : 1}
                onPress={resetFilters}
                disabled={isResetDisabled}
            >
                <Text
                    color={isResetDisabled ? COLORS.black : COLORS.white}
                    fontSize={FONT_SIZE.large}
                    fontWeight="600"
                >
                    {t('history.resetFilter')}
                </Text>
            </Button>

            {/* Exercise List */}
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
