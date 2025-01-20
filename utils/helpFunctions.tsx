import { Result, GroupedResult } from "./types";


export function toTitleCase(word: string) {
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

export function filterByMuscleGroup(data, targetGroup) {
    const filteredData = {};

    for (const [exercise, records] of Object.entries(data)) {
        const filteredRecords = records.filter(record => record.muscleGroup === targetGroup);
        if (filteredRecords.length > 0) {
            filteredData[exercise] = filteredRecords;
        }
    }
    return filteredData;
}
