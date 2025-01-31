import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { settingsStore } from "@/store/store"
import { COLORS } from "@/styles/colors"
import { getProgress, toTitleCase } from "@/utils/helpFunctions"
import { useTranslation } from "react-i18next";
import { FONT_SIZE } from "@/styles/colors"
import { TouchableOpacity } from "react-native-gesture-handler"
import { fetchResultByExerciseId } from "@/services/db"
import Result from "@/components/Result";
import { deleteResult } from "@/services/db"
import { TResult } from "@/utils/types"


export default function Exercise({ id, title, type, sorting, setError }: any) {
    const { t } = useTranslation();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<TResult[]>([]);

    const filteredResults = sorting === 'asc' 
        ? results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) 
        : results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const getResultsByExercise = async () => {
        setIsLoading(true)
        try {
            const res = await fetchResultByExerciseId(id)
            setResults(res)
        } catch (e) {
            console.error(e)
            setError(`${e}`)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            // avoid queries every time the window is open
            if (results.length < 1) {
                getResultsByExercise()
            }
        }
    }, [isOpen])
    

    const handleDeleteResult = async (resultId: number) => {
        try {
            await deleteResult(resultId);
            Alert.alert(
                t('alerts.success'),
                t('alerts.recordDeleted'),
            );
            
            setResults((prevResults) => {
                const updatedResults = prevResults.filter(item => item.id !== resultId)
                return updatedResults;
            });
        } catch (e) {
            console.error(e);
            Alert.alert(
                t('alerts.error'),
                t('alerts.failedDeletingRecord'),
            );
        }
    };


    return (
        <>
        <View style={[s.exerciseSection, { backgroundColor: settingsStore.isDark ? COLORS.darkGrey : COLORS.white }]}>
        <TouchableOpacity onPress={() => setIsOpen(prev => !prev)}>
            <Text style={[s.exerciseHeader, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.textTitleColorLight}]}>{toTitleCase(title)} ({type})</Text>
            {isOpen &&
            <View style={[s.row, s.headerRow, { backgroundColor: settingsStore.isDark ? COLORS.darkDarkGrey :'#f1f3f5', borderBottomColor: settingsStore.isDark ? COLORS.black : '#e9ecef'}]}>
                <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.date')}</Text>
                <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.weight')}</Text>
                <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.reps')}</Text>
                <Text style={[s.cell, s.headerCell, { color: settingsStore.isDark ? COLORS.textDarkScreen : '#495057'}]}>{t('history.table.header.edit')}</Text>
            </View>
            }
            {isOpen && isLoading && <ActivityIndicator />}
        </TouchableOpacity>
        {isOpen && filteredResults.length < 1 && <View style={s.notFound}><Text style={s.text}>{t('history.noResults')}</Text></View>}
        {isOpen &&
        filteredResults.map((item, index) => {
            let progress = 'new'

            if (sorting === 'desc') {
                const len = results.length
                if (index + 1 < len) {
                    console.log(0)
                    const previousSet = results[index + 1]
                    progress = getProgress(item, previousSet)
                }
            } else {
                if (index > 0) {
                    console.log(1)
                    const previousSet = results[index - 1]
                    progress = getProgress(item, previousSet)
                }
            }

            return (
                <Result 
                    key={item.id} 
                    resultId={item.id} 
                    date={item.date} 
                    weight={item.weight} 
                    reps={item.reps} 
                    units={item.units}
                    progress={progress}
                    deleteResult={handleDeleteResult}
                />
            )
        })}
        </View>
        </>
    )
}

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
    headerCell: {
        fontWeight: 'bold',
    },
});