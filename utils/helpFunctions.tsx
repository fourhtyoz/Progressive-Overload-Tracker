import { Result, GroupedResult } from "./types";
import { settingsStore } from "@/store/store";


export function getProgress(currentSet: Result, previousSet: Result) {
    const defaultUnits = settingsStore.units

    let progress = ''

    // * 0.453 to kg
    // * 2.205 to lb
    let previousScore = previousSet.weight * previousSet.reps
    if (previousSet.units !== defaultUnits) {
        if (defaultUnits === 'kg') {
            previousScore = previousScore * 0.453
        }
        if (defaultUnits === 'lb') {
            previousScore = previousScore * 2.205
        }
    }

    let currentScore = currentSet.weight * currentSet.reps
    if (currentSet.units !== defaultUnits) {
        if (defaultUnits === 'kg') {
            currentScore = currentScore * 0.453
        } 
        if (defaultUnits === 'lb') {
            currentScore = currentScore * 2.205
        }
    }

    if (previousScore > currentScore) {
        progress = 'worse'
    } else if (previousScore < currentScore) {
        progress = 'better'
    } else {
        progress = 'neutral'
    }
    return progress
}


export function getformattedDate(date: string | Date) {
    if (date instanceof Date) {
        date = date.toISOString()
    }

    const [year, month, day] = date.split('T')[0].split('-');
    const formattedDate = `${day}.${month}.${year.slice(-2)}`;

    return formattedDate
}


export function toTitleCase(word: string) {
    if (!word || word.length < 1) return word;
    
    return (word.charAt(0).toUpperCase() + word.slice(1))
}


export function groupByExercise(dataArray: Result[]) {
    const grouped: GroupedResult = {};

    dataArray.forEach((item: Result) => {
        if (!grouped[item.exercise]) {
            grouped[item.exercise] = [];
        }
        grouped[item.exercise].push(item);
    });

    return grouped;
}


export function filterByMuscleGroup(data: any, targetGroup: any) {
    const filteredData: any = {};

    for (const [exercise, records] of Object.entries(data)) {
        const filteredRecords = (records as Result[]).filter((record: Result) => record.muscleGroup === targetGroup);
        if (filteredRecords.length > 0) {
            filteredData[exercise] = filteredRecords;
        }
    }
    return filteredData;
}
