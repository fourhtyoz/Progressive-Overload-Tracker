import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import { useTranslation } from 'react-i18next';

import Loader from '@/components/Loader';
import Exercise from '@/components/Exercise';
import ErrorMessage from '@/components/ErrorMessage';
import { settingsStore } from '@/store/store';
import { fetchExercises } from '@/services/db';
import { COLORS, FONT_SIZE } from '@/styles/globalStyles';
import { toTitleCase } from '@/utils/helpFunctions';
import { TExercise } from '@/utils/types';


export default function HistoryScreen() {
    const { t } = useTranslation();

    const [exercises, setExercises] = useState<any>([]);
    const [muscleOptions, setMuscleOptions] = useState<string[]>([]);
    const [selectedMuscle, setSelectedMuscle] = useState('-');
    const [selectedSorting, setSelectedSorting] = useState({title: t('history.byDateRecentFirst'), type: 'desc'});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const resetFilters = () => {
        setSelectedMuscle('-');
    };


    const isResetDisabled = selectedMuscle === '-'

    useFocusEffect(
        useCallback(() => {
            getExercises()
            
            return () => {
                setMuscleOptions([]);
                setSelectedMuscle('-')
                setError('')
            }
        }, [selectedSorting])
    )

    const getExercises = async () => {
        setIsLoading(true)
        try {
            const res = await fetchExercises()
            if (!Array.isArray(res)) {
                throw new Error('fetchExercises returned no array')
            }
            setExercises(res)

            const types = Array.from(new Set(res.map(item => item.type)))
            setMuscleOptions(types)
        } catch (e) {
            const error = `${t('errors.failedFetchResults')} ${e}`
            console.error(error);
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <ScrollView style={s.container}>
            {error && <View style={{ marginBottom: 15 }}><ErrorMessage message={error} setError={setError} /></View>}
            <View style={s.filterWrapper}>
                <Text style={[s.filterTitle, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('history.sorting')}:</Text>
                <SelectDropdown
                    data={[{title: t('history.byDateRecentFirst'), type: 'desc'}, {title: t('history.byDateOldestFirst'), type: 'asc'}]}
                    defaultValue={{title: t('history.byDateRecentFirst'), type: 'desc'}}
                    onSelect={(selectedItem, _) => setSelectedSorting(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={s.dropdownMenuStyle}
                    renderButton={(_) => (
                        <View style={s.dropdownButton}>
                            <Text style={[
                                s.selectedItem, 
                                { 
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.black,
                                    color: settingsStore.isDark ? COLORS.black : COLORS.white
                                }]}
                            >{selectedSorting.title}</Text>
                        </View>
                    )}
                    renderItem={(item, index, _) => { 
                        return (
                            <View key={index} style={[s.dropdownItemStyle, item.type === selectedSorting.type && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                                <Text style={s.dropdownItemTxtStyle}>{toTitleCase(item.title)}</Text>
                            </View>
                    )}}
                />
            </View>
            <View style={s.filterWrapper}>
                <Text style={[s.filterTitle, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('history.table.header.muscle')}:</Text>
                <SelectDropdown
                    data={muscleOptions}
                    defaultValue={muscleOptions.filter(item => item ==='-')[0]}
                    onSelect={(selectedItem, _) => setSelectedMuscle(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={s.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={s.dropdownButton}>
                            {selectedMuscle === '-'
                            ? <Text style={[
                                s.selectedItem, 
                                { 
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.black,
                                    color: settingsStore.isDark ? COLORS.black : COLORS.white
                                }]}>{'-'}</Text>
                            : <Text style={[
                                s.selectedItem, 
                                { 
                                    backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.black,
                                    color: settingsStore.isDark ? COLORS.black : COLORS.white
                                }]}>{toTitleCase(selectedItem)}</Text>
                            } 
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View key={index} style={[s.dropdownItemStyle, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                            <Text style={s.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <TouchableOpacity style={[s.resetButton, isResetDisabled && s.resetButtonDisabled]} onPress={resetFilters} disabled={isResetDisabled}>
                <Text style={[s.resetButtonText, isResetDisabled && s.resetButtonTextDisabled]}>{t('history.resetFilter')}</Text>
            </TouchableOpacity>
            {selectedMuscle !== '-' 
            ? exercises.filter((item: TExercise) => item.type === selectedMuscle).map((item: TExercise) => (<Exercise key={item.id} id={item.id} title={item.title} type={item.type} sorting={selectedSorting.type} setError={setError} />))
            : exercises.map((item: TExercise) => (<Exercise key={item.id} id={item.id} title={item.title} type={item.type} sorting={selectedSorting.type} setError={setError} />))
            }
        </ScrollView>
    )
};

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
        backgroundColor: '#e0e0e0',
        opacity: 0.5
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
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: FONT_SIZE.normal,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownWrapper: {
        paddingHorizontal: 10
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
        borderColor: COLORS.blackTransparentBorder
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
        borderTopLeftRadius: 5
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
