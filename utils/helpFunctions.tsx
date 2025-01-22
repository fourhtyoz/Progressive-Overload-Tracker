import { Result, GroupedResult } from "./types";


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
    const filteredData = {};

    for (const [exercise, records] of Object.entries(data)) {
        const filteredRecords = records.filter((record: Result) => record.muscleGroup === targetGroup);
        if (filteredRecords.length > 0) {
            filteredData[exercise] = filteredRecords;
        }
    }
    return filteredData;
}
