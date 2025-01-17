export function toTitleCase(word: string) {
    return (word.charAt(0).toUpperCase() + word.slice(1))
}

export function groupByExercise(dataArray) {
    const grouped = {};

    dataArray.forEach(item => {
        if (!grouped[item.exercise]) {
            grouped[item.exercise] = [];
        }
        grouped[item.exercise].push(item);
    });

    return grouped;
}
