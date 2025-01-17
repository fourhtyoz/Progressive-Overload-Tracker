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
