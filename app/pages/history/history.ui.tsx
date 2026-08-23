import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Button, Label, Text, XStack, YStack } from 'tamagui';

import Exercise from '@/app/pages/history/ui/exercise-row.ui';
import { toTitleCase } from '@/app/shared/lib/formatters.lib';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { COLORS } from '@/app/shared/theme/global-styles';
import { useFontSize } from '@/app/shared/theme/use-font-size';
import { TExercise } from '@/app/shared/types';
import ErrorMessage from '@/app/shared/ui/error-message.ui';
import Loader from '@/app/shared/ui/loader.ui';
import {
    DropdownInput,
    DropdownItem,
    DropdownItemText,
    DropdownText,
    ThemedDropdown,
} from '@/app/shared/ui/themed-dropdown.ui';

export default observer(function HistoryScreen() {
    const { t } = useTranslation();
    const { exercises, isLoading, error, muscleOptions, resetError, setError } = exerciseStore;

    const [selectedMuscle, setSelectedMuscle] = useState('-');
    const [selectedSorting, setSelectedSorting] = useState({
        title: t('history.byDateRecentFirst'),
        type: 'desc',
    });

    const resetFilters = () => {
        setSelectedMuscle('-');
        setSelectedSorting({ title: t('history.byDateRecentFirst'), type: 'desc' });
    };

    const isResetDisabled = selectedMuscle === '-' && selectedSorting.type === 'desc';
    const fontSize = useFontSize();

    const filteredExercises = useMemo(() => {
        if (selectedMuscle !== '-') {
            return exercises.filter((item: TExercise) => item.type === selectedMuscle);
        }
        return exercises;
    }, [exercises, selectedMuscle]);

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
            <XStack alignItems="center" gap={10} marginTop={5}>
                <Label flex={1} fontWeight="700" color="$color">
                    {t('history.sorting')}:
                </Label>
                <XStack flex={2}>
                    <ThemedDropdown
                        data={[
                            { title: t('history.byDateRecentFirst'), type: 'desc' },
                            { title: t('history.byDateOldestFirst'), type: 'asc' },
                        ]}
                        defaultValue={{ title: t('history.byDateRecentFirst'), type: 'desc' }}
                        onSelect={(selectedItem, _) => setSelectedSorting(selectedItem)}
                        renderButton={() => (
                            <DropdownInput>
                                <DropdownText>{selectedSorting.title}</DropdownText>
                            </DropdownInput>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <DropdownItem isSelected={isSelected}>
                                <DropdownItemText>{toTitleCase(item.title)}</DropdownItemText>
                            </DropdownItem>
                        )}
                    />
                </XStack>
            </XStack>

            {/* Muscle Filter */}
            <XStack alignItems="center" gap={10} marginTop={5}>
                <Label flex={1} fontWeight="700" color="$color">
                    {t('history.table.header.muscle')}:
                </Label>
                <XStack flex={2}>
                    <ThemedDropdown
                        data={muscleOptions}
                        defaultValue={undefined}
                        onSelect={(selectedItem, _) => setSelectedMuscle(selectedItem)}
                        renderButton={() => (
                            <DropdownInput>
                                <DropdownText>
                                    {selectedMuscle === '-' ? '-' : t('muscles.' + selectedMuscle)}
                                </DropdownText>
                            </DropdownInput>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <DropdownItem isSelected={isSelected}>
                                <DropdownItemText>{t('muscles.' + item)}</DropdownItemText>
                            </DropdownItem>
                        )}
                    />
                </XStack>
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
                    fontSize={fontSize.large}
                    fontWeight="600"
                >
                    {t('history.resetFilter')}
                </Text>
            </Button>

            {/* Legend */}
            {filteredExercises.length > 0 && (
                <XStack gap={16} alignItems="center" justifyContent="center" marginBottom={10}>
                    <XStack alignItems="center" gap={6}>
                        <Ionicons name="trending-up" size={16} color={COLORS.green} />
                        <Text fontSize={fontSize.normal} color="$colorMuted">
                            {t('history.legend.better')}
                        </Text>
                    </XStack>
                    <XStack alignItems="center" gap={6}>
                        <Ionicons name="remove" size={16} color={COLORS.orange} />
                        <Text fontSize={fontSize.normal} color="$colorMuted">
                            {t('history.legend.neutral')}
                        </Text>
                    </XStack>
                    <XStack alignItems="center" gap={6}>
                        <Ionicons name="trending-down" size={16} color={COLORS.red} />
                        <Text fontSize={fontSize.normal} color="$colorMuted">
                            {t('history.legend.worse')}
                        </Text>
                    </XStack>
                </XStack>
            )}

            {/* Exercise List */}
            {filteredExercises.length === 0 ? (
                <YStack alignItems="center" paddingVertical={40} gap={8}>
                    <Text fontSize={fontSize.large} fontWeight="600" color="$colorMuted">
                        {t('alerts.noExerciseTitle')}
                    </Text>
                    <Text fontSize={fontSize.normal} color="$colorMuted" textAlign="center">
                        {t('alerts.noExercise')}
                    </Text>
                </YStack>
            ) : (
                filteredExercises.map((item: TExercise) => (
                    <Exercise
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        type={item.type}
                        sorting={selectedSorting.type}
                        setError={setError}
                    />
                ))
            )}
        </ScrollView>
    );
});
